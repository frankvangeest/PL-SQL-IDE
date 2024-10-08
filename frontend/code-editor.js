const codeEditor     = document.getElementById('code');
const lineNumbersDiv = document.getElementById('line-numbers');
const fileTree       = document.getElementById('file-list');
const tabs           = document.getElementById('tabs');

let activeTab = 'file_1.sql'; // Track the active tab
let sql_types,
    sql_procs;

const contents = {
  'file_1.sql': `SELECT * FROM users;`,
  'file_2.sql': `INSERT INTO users (id, name) VALUES (1, 'John Doe');`,
  'file_3.sql': `-- This is a single-line comment

  /*
      This is a
      multi-line comment
  */
  
  DECLARE
      -- Variable declaration
      v_employee_name VARCHAR2(50);
      v_salary        NUMBER(10,2) := 5500.50;
      v_bonus         CONSTANT NUMBER(5,2) := 500.00;
      v_department_id NUMBER(4);
  
      -- Cursor declaration
      CURSOR c_employees IS
          SELECT employee_id, first_name, last_name
          FROM employees
          WHERE department_id = v_department_id;
          
  BEGIN
      -- Assigning values
      v_employee_name := 'John Doe';
      v_department_id := 30;
      
      -- Conditional statement
      IF v_salary > 5000 THEN
          v_salary := v_salary + v_bonus;
      ELSE
          v_salary := v_salary + (v_bonus / 2);
      END IF;
      
      -- Loop through the cursor
      FOR r_employee IN c_employees LOOP
          DBMS_OUTPUT.PUT_LINE('Employee: ' || r_employee.first_name || ' ' || r_employee.last_name);
      END LOOP;
      
      -- Function call
      v_salary := ROUND(v_salary, 2);
  
      -- Output the results
      DBMS_OUTPUT.PUT_LINE('Final Salary: ' || v_salary);
  
  EXCEPTION
      -- Exception handling
      WHEN OTHERS THEN
          DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
  END;
  `
};

codeEditor.addEventListener('input', handleInput);
codeEditor.addEventListener('scroll', syncScroll);
codeEditor.addEventListener('keyup', updateLineNumbers);

function handleInput() {
  saveContent();
  updateEditor();
}

function updateEditor() {
  const code            = codeEditor.innerText;
  const highlightedCode = syntaxHighlight(code);
  codeEditor.innerHTML = highlightedCode;
  placeCaretAtEnd(codeEditor);
  updateLineNumbers();
}

function updateLineNumbers() {
  const lineNumbers = document.getElementById('line-numbers');
  const lines       = codeEditor.innerText.split('\n');
  lineNumbers.innerHTML = lines.map((_, index) => `<div>${index + 1}</div>`).join('');
}

function syncScroll() {
  lineNumbersDiv.scrollTop = codeEditor.scrollTop;
}

function placeCaretAtEnd(el) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function syntaxHighlight(code) {
  // Replace special characters to display correctly in HTML
  let htmlCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // PL/SQL keywords
  // Based on https://docs.oracle.com/en/database/oracle/oracle-database/19/lnpls/plsql-reserved-words-keywords.html
  const keywords = [
    "ALL", "ALTER", "AND", "ANY", "AS", "ASC", "AT",
    "BEGIN", "BETWEEN", "BY",
    "CASE", "CHECK", "CLUSTERS", "CLUSTER", "COLAUTH", "COLUMNS", "COMPRESS", "CONNECT", "CRASH", "CREATE", "CURSOR",
    "DECLARE", "DEFAULT", "DESC", "DISTINCT", "DROP",
    "ELSE", "END", "EXCEPTION", "EXCLUSIVE",
    "FETCH", "FOR", "FROM", "FUNCTION",
    "GOTO", "GRANT", "GROUP",
    "HAVING",
    "IDENTIFIED", "IF", "IN", "INDEX", "INDEXES", "INSERT", "INTERSECT", "INTO", "IS",
    "LIKE", "LOCK",
    "MINUS", "MODE",
    "NOCOMPRESS", "NOT", "NOWAIT", "NULL",
    "OF", "ON", "OPTION", "OR", "ORDER", "OVERLAPS",
    "PROCEDURE", "PUBLIC",
    "RESOURCE", "REVOKE",
    "SELECT", "SHARE", "SIZE", "SQL", "START", "SUBTYPE",
    "TABAUTH", "TABLE", "THEN", "TO", "TYPE",
    "UNION", "UNIQUE", "UPDATE",
    "VALUES", "VIEW", "VIEWS",
    "WHEN", "WHERE", "WITH",
    "A", "ADD", "ACCESSIBLE", "AGENT", "AGGREGATE", "ARRAY", "ATTRIBUTE", "AUTHID", "AVG",
    "BFILE_BASE", "BINARY", "BLOB_BASE", "BLOCK", "BODY", "BOTH", "BOUND", "BULK", "BYTE",
    "C", "CALL", "CALLING", "CASCADE", "CHAR", "CHAR_BASE", "CHARACTER", "CHARSET", "CHARSETFORM", "CHARSETID", "CLOB_BASE", "CLONE", "CLOSE", "COLLECT", "COMMENT", "COMMIT", "COMMITTED", "COMPILED", "CONSTANT", "CONSTRUCTOR", "CONTEXT", "CONTINUE", "CONVERT", "COUNT", "CREDENTIAL", "CURRENT", "CUSTOMDATUM",
    "DANGLING", "DATA", "DATE", "DATE_BASE", "DAY", "DEFINE", "DELETE", "DETERMINISTIC", "DIRECTORY", "DOUBLE", "DURATION",
    "ELEMENT", "ELSIF", "EMPTY", "ESCAPE", "EXCEPT", "EXCEPTIONS", "EXECUTE", "EXISTS", "EXIT", "EXTERNAL",
    "FINAL", "FIRST", "FIXED", "FLOAT", "FORALL", "FORCE",
    "GENERAL",
    "HASH", "HEAP", "HIDDEN", "HOUR",
    "IMMEDIATE", "INCLUDING", "INDICATOR", "INDICES", "INFINITE", "INSTANTIABLE", "INT", "INTERFACE", "INTERVAL", "INVALIDATE", "ISOLATION",
    "JAVA",
    "LANGUAGE", "LARGE", "LEADING", "LENGTH", "LEVEL", "LIBRARY", "LIKE2", "LIKE4", "LIKEC", "LIMIT", "LIMITED", "LOCAL", "LONG", "LOOP",
    "MAP", "MAX", "MAXLEN", "MEMBER", "MERGE", "MIN", "MINUTE", "MOD", "MODIFY", "MONTH", "MULTISET",
    "NAME", "NAN", "NATIONAL", "NATIVE", "NCHAR", "NEW", "NOCOPY", "NUMBER_BASE",
    "OBJECT", "OCICOLL", "OCIDATE", "OCIDATETIME", "OCIDURATION", "OCIINTERVAL", "OCILOBLOCATOR", "OCINUMBER", "OCIRAW", "OCIREF", "OCIREFCURSOR", "OCIROWID", "OCISTRING", "OCITYPE", "OLD", "ONLY", "OPAQUE", "OPEN", "OPERATOR", "ORACLE", "ORADATA", "ORGANIZATION", "ORLANY", "ORLVARY", "OTHERS", "OUT", "OVERRIDING",
    "PACKAGE", "PARALLEL_ENABLE", "PARAMETER", "PARAMETERS", "PARENT", "PARTITION", "PASCAL", "PERSISTABLE", "PIPE", "PIPELINED", "PLUGGABLE", "POLYMORPHIC", "PRAGMA", "PRECISION", "PRIOR", "PRIVATE",
    "RAISE", "RANGE", "RAW", "READ", "RECORD", "REF", "REFERENCE", "RELIES_ON", "REM", "REMAINDER", "RENAME", "RESULT", "RESULT_CACHE", "RETURN", "RETURNING", "REVERSE", "ROLLBACK", "ROW",
    "SAMPLE", "SAVE", "SAVEPOINT", "SB1", "SB2", "SB4", "SECOND", "SEGMENT", "SELF", "SEPARATE", "SEQUENCE", "SERIALIZABLE", "SET", "SHORT", "SIZE_T", "SOME", "SPARSE", "SQLCODE", "SQLDATA", "SQLNAME", "SQLSTATE", "STANDARD", "STATIC", "STDDEV", "STORED", "STRING", "STRUCT", "STYLE", "SUBMULTISET", "SUBPARTITION", "SUBSTITUTABLE", "SUM", "SYNONYM",
    "TDO", "THE", "TIME", "TIMESTAMP", "TIMEZONE_ABBR", "TIMEZONE_HOUR", "TIMEZONE_MINUTE", "TIMEZONE_REGION", "TRAILING", "TRANSACTION", "TRANSACTIONAL", "TRUSTED",
    "UB1", "UB2", "UB4", "UNDER", "UNPLUG", "UNSIGNED", "UNTRUSTED", "USE", "USING",
    "VALIST", "VALUE", "VARIABLE", "VARIANCE", "VARRAY", "VARYING", "VOID",
    "WHILE", "WORK", "WRAPPED", "WRITE",
    "YEAR",
    "ZONE"
  ];

  // Simple syntax highlighting for keywords (case-insensitive)
  keywords.forEach(keyword => {
    const pattern = new RegExp('\\b' + keyword + '\\b', 'gi');
    htmlCode = htmlCode.replace(pattern, match => `<span class="keyword">${match}</span>`);
  });

  // Oracle SQL Types
  // Based on https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Data-Types.html#GUID-0BC16006-32F1-42B1-B45E-F27A494963FF
  const types = [
    // Character / String
    "VARCHAR", "VARCHAR2", "CHAR", "NCHAR", "NVARCHAR2", "CLOB", "NCLOB", 
    // Numeric
    "NUMBER", "INTEGER", "FLOAT", "LONG", 
    // Binary
    "BLOB", "BINARY_FLOAT", "BINARY_DOUBLE",
    // Date & time
    "YEAR", "MONTH", "MONTH", "DAY", "HOUR", "MINUTE", "SECOND", "DATE", "DATETIME", "TIMESTAMP", "TIMEZONE_HOUR", "TIMEZONE_MINUTE", "TIMEZONE_REGION", "TIMEZONE_ABBR"
  ];
    
  // Simple syntax highlighting for Oracle SQL Types (case-insensitive)
  types.forEach(type_name => {
    const pattern = new RegExp('\\b' + type_name + '\\b', 'gi');
    htmlCode = htmlCode.replace(pattern, match => `<span class="type">${match}</span>`);
  });

  // PL/SQL build-in functions
  const functions = [
    "ABS", "ACOS", "ADD_MONTHS", "ASCII", "ASCIISTR", "ASIN", "ATAN", "ATAN2", "AVG",
    "BFILENAME", "BIN_TO_NUM", "BITAND",
    "CARDINALITY", "CASE", "CAST", "CEIL", "CHARTOROWID", "CHR", "COALESCE", "COMPOSE", "CONCAT", "CONVERT", "CORR", "COS", "COSH", "COUNT", "COVAR_POP", "COVAR_SAMP", "CUME_DIST", "CURRENT_DATE", "CURRENT_TIMESTAMP",
    "DBTIMEZONE", "DECODE", "DECOMPOSE", "DENSE_RANK", "DUMP",
    "EMPTY_BLOB", "EMPTY_CLOB", "EXP", "EXTRACT",
    "FIRST_VALUE", "FLOOR", "FROM_TZ",
    "GREATEST", "GROUP_ID",
    "HEXTORAW",
    "INITCAP", "INSTR", "INSTR2", "INSTR4", "INSTRB", "INSTRC",
    "LAG", "LAST_DAY", "LAST_VALUE", "LEAD", "LEAST", "LENGTH", "LENGTH2", "LENGTH4", "LENGTHB", "LENGTHC", "LISTAGG", "LN", "LNNVL", "LOCALTIMESTAMP", "LOG", "LOWER", "LPAD", "LTRIM",
    "MAX", "MEDIAN", "MIN", "MOD", "MONTHS_BETWEEN",
    "NANVL", "NCHR", "NEW_TIME", "NEXT_DAY", "NTH_VALUE", "NULLIF", "NUMTODSINTERVAL", "NUMTOYMINTERVAL", "NVL", "NVL2",
    "POWER",
    "RANK", "RAWTOHEX", "REGEXP_COUNT", "REGEXP_INSTR", "REGEXP_REPLACE", "REGEXP_SUBSTR", "REMAINDER", "REPLACE", "ROUND", "ROWNUM", "RPAD", "RTRIM",
    "SESSIONTIMEZONE", "SIGN", "SIN", "SINH", "SOUNDEX", "SQRT", "STDDEV", "SUBSTR", "SUM", "SYS_CONTEXT", "SYSDATE", "SYSTIMESTAMP", "SQLCODE", "SQLERRM",
    "TAN", "TANH", "TO_CHAR", "TO_CLOB", "TO_DATE", "TO_DSINTERVAL", "TO_LOB", "TO_MULTI_BYTE", "TO_NCLOB", "TO_NUMBER", "TO_SINGLE_BYTE", "TO_TIMESTAMP", "TO_TIMESTAMP_TZ", "TO_YMINTERVAL", "TRANSLATE", "TRIM", "TRUNC", "TZ_OFFSET",
    "UID", "UPPER", "USER", "USERENV",
    "VAR_POP", "VAR_SAMP", "VARIANCE", "VSIZE"
  ];


  // Simple syntax highlighting for build-in functions (case-insensitive)
  functions.forEach(function_name => {
    const pattern = new RegExp('\\b' + function_name + '\\b', 'gi');
    htmlCode = htmlCode.replace(pattern, match => `<span class="function_name">${match}</span>`);
  });

   // PL/SQL build-in procedures
  const procedures = [
    'DBMS_OUTPUT', 'PUT_LINE'
  ];

  // Simple syntax highlighting for build-in procedures (case-insensitive)
  procedures.forEach(proc_name => {
    const pattern = new RegExp('\\b' + proc_name + '\\b', 'gi');
    htmlCode = htmlCode.replace(pattern, match => `<span class="procedure_name">${match}</span>`);
  });

  // Simple syntax highlighting for single line comments
  htmlCode = htmlCode.replace(/(--[^\n]*)/g, '<span class="comment">$1</span>');

  // Simple syntax highlighting for Multi line comments
  htmlCode = htmlCode.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');

  // Simple syntax highlighting for strings
  htmlCode = htmlCode.replace(/('.*?')/g, '<span class="string">$1</span>');

  // Simple syntax highlighting for numbers
  htmlCode = htmlCode.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

  // Simple syntax highlighting for variables
  htmlCode = htmlCode.replace(/\b(v_|r_|c_|l_)\w*\b/g, '<span class="variable">$&</span>');

  // Simple syntax highlighting for constants
  htmlCode = htmlCode.replace(/\b(gc_|lc_)\w*\b/g, '<span class="constant">$&</span>');

  return htmlCode;
}

function loadContent(contentKey, tabId) {
  // Save the content of the current tab
  saveContent();

  // Load the content of the new tab
  codeEditor.innerText = contents[contentKey] || '';
  updateEditor();

  // Update active tab
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  const tabElement = document.getElementById(tabId);
  if (tabElement) {
    tabElement.classList.add('active');
  }
  activeTab = contentKey; // Track the active tab
}

function saveContent() {
  if (activeTab && codeEditor.innerText !== contents[activeTab]) {
    contents[activeTab] = codeEditor.innerText;
  }
}

function createNewFile() {
  const fileName = prompt('Enter the new file name (with .sql extension):');
  if (fileName && !contents.hasOwnProperty(fileName)) {
    contents[fileName] = '';

    // Create a new editor tab for the given file
    const newTabId = 'tab' + (Object.keys(contents).length);
    const newTab   = document.createElement('button');
    newTab.id = newTabId;
    newTab.className = 'tab-button';
    newTab.textContent = fileName;
    newTab.onclick = () => loadContent(fileName, newTabId);
    
    // Add the new file before the + tab
    const newTabButton = document.getElementById('new-tab');
    const fileTabs     = document.getElementById('file-tabs');
    console.log('newTabButton', newTabButton);
    console.log('fileTabs', fileTabs);
    if (newTabButton && fileTabs) {
      fileTabs.insertBefore(newTab, newTabButton);
    } else {
      console.warn('New tab button or tabs element is missing.');
    }

    // Create new project tree element
    const newFile = document.createElement('li');
    newFile.textContent = fileName;
    newFile.onclick = () => loadContent(fileName, newTabId);

    // Add file to the project tree
    const fileTree = document.getElementById('file-tree');
    if (fileTree) {
      fileTree.appendChild(newFile);
    } else {
      console.warn('File tree element is missing.');
    }
  } else if (!fileName) {
    console.warn('File name is not provided.');
  } else {
    console.warn('File name already exists.');
  }
}

// function applyFallbackIcons(fallbackSrc) {
//   // Select all button elements with an img element inside
//   const buttons = document.querySelectorAll('button img');
//   console.log('querySelectorAll(button img): ', buttons);
//   console.log('fallbackSrc: ', fallbackSrc)

//   buttons.forEach(img => {
//       // Add an error event listener to each img element
//       img.onerror = () => {this.onerror=null; this.src='assets/icons/fallback-icon.svg';};
//       console.log('img: ', img);
//   });
//   console.log('Fallback Icons Applied.')
// }

// Initialize line numbers and load the content of the active tab on page load
window.onload = () => {
  loadContent(activeTab, 'tab1');
  updateLineNumbers();
};

// document.addEventListener('DOMContentLoaded', () => {
//   applyFallbackIcons('assets/icons/fallback-icon.svg');
// });