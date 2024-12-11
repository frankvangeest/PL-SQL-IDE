
function data_type_to_class(data_type) {
	let data_type_class = '';
	if (data_type == 'Date') {
	    data_type_class = 'data-type-date';
	}
	else if (data_type.includes("Varchar2")) {
	    data_type_class = 'data-type-text';
	}
	else if (data_type.includes("Number")) {
	    data_type_class = 'data-type-number';
	}
	else if (data_type.includes("Clob")) {
	    data_type_class = 'data-type-text';
	}
	return data_type_class;
}

function render_db_data(div_id, json_table_data) {
	console.log('div_id: ', div_id);
	console.log('json_table_data: ', json_table_data);
	// Validate json_table_data
        
	  // is valid json

	  // has headers

	  // has colomn types

	  // has rows

	// Get meta data
	

	// Render data
        const contentContainer = document.querySelector('#' + div_id);

        const table = document.createElement('table');
        table.classList.add("table");
        table.classList.add("table-dark");
		table.classList.add("table-striped");
        table.classList.add("table-sm");
		table.classList.add("table-bordered");
		table.classList.add("table-hover");
		table.classList.add("table-responsive");
        contentContainer.appendChild(table);

		const thead = document.createElement('thead');
        table.appendChild(thead);
		const thr = document.createElement('tr');
        thead.appendChild(thr);
	
		// rownum
 		const thn = document.createElement('th');
        thn.setAttribute("scope", "col");
		thn.innerHTML = '#';
        thr.appendChild(thn);

		let cnt = 0;
        json_table_data.column_names.forEach(value => {
			const th = document.createElement('th');
			th.setAttribute("scope", "col");
			th.innerHTML = value;
			thr.appendChild(th);
			cnt = cnt + 1;
		});

/*
	const thr2 = document.createElement('tr');
        thead.appendChild(thr2);

        json_table_data.column_types.forEach(value => {
 	  const th = document.createElement('th');
          th.setAttribute("scope", "col");
          th.innerHTML = value;
          thr2.appendChild(th);
        });
*/

  	const tbody = document.createElement('tbody');
        let row_nr = 1;
        json_table_data.rows.forEach(row => {
            console.log('row: ', row);
            const tr = document.createElement('tr');

	    // Rownum
	    const tdn = document.createElement('td');
            tdn.innerHTML = row_nr;
            tr.appendChild(tdn);
	    
    	    let cell_nr = 0;
            row.forEach(value => {
                console.log('row value: ',value);
                const td = document.createElement('td');
                td.innerHTML = value;

		let data_type_class = data_type_to_class(json_table_data.column_types[cell_nr]);
	  	if (data_type_class  != '') {
	    	  td.classList.add(data_type_class);
	  	}
                tr.appendChild(td);
		cell_nr = cell_nr + 1;
            });

            table.appendChild(tr);
	    row_nr= row_nr + 1;
        });

	table.appendChild(tbody);

}