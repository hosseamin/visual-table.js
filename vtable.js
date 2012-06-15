/*
  visual table does simple table look by positioning
  his rows and columns
*/
var VTABLE_FIXED = 1;
var VTABLE_DYNAMIC = 2;
var vtable = function()
{
    this.vtable_construct();
}
function inherit_vtable(ivt)
{
ivt.prototype.vtable_construct = function()
{
    this.rows = new Array(0);
    this.rows_oinfo = new Array(0);
    this.colsp = new Array(0);
    this.rowsp = new Array(0);
    this.spaned = new Array(0);
}
ivt.prototype.updateSpaned = function()
{
    switch(this.span_method)
    {
    case 'pc':
	var rlen = this.rows.length;
	var sp = this.spaned;
	for(i = sp.length; i < rlen; ++i)
	{
	    sp[i] = new Array(0);
	}
	break;
    case 'pr':
	var clen = vt.colsp.length;
	var sp = this.spaned;
	for(i = sp.length; i < clen; ++i)
	{
	    sp[i] = new Array(0);
	}
	break;
    }
}
ivt.prototype.clearSpaned = function()
{
    var sp = this.spaned;
    ilen = sp.length;
    for(i = 0; i < ilen; ++i)
    {
	var csp = sp[i];
	var clen = csp.length;
	for(c = 0; c < clen; ++c)
	    csp[c] = false;
    }
}
ivt.prototype.addcell = function(r,cell)
{
    // what about when span method is `pr'
    var row = this.rows[r];
    var row_oinfo = this.rows_oinfo[r];
    if(!row)
	return null;
    var cell_oinfo = new vcell_oinfo(cell);
    row.push(cell);
    row_oinfo.push(cell_oinfo);
    // this step is not necessary
    this.updateRow(row);
    return cell;
}
ivt.prototype.popcell = function(r)
{
    var row = this.rows[r];
    var row_oinfo = this.rows_oinfo[r];
    if(!row)
	return null;
    var len = row.length;
    if(len > 0)
    {
	row_oinfo.pop();
	return row.pop();
    }
    else
	return null;
}
ivt.prototype.updateRow = function(row)
{
    var len = row.length;
    this.addColPUpto(len);
}
ivt.prototype.addColPUpto = function(c)
{
    var i = this.colsp.length;
    var colp;
    while(i < c)
    {
	colp = new vcolProperties();
	this.colsp.push(colp);
	++i;
    }
}
ivt.prototype.addRowPUpto = function(r)
{
    var i = this.rowsp.length;
    var rowp;
    while(i < r)
    {
	rowp = new vrowProperties();
	this.rowsp.push(rowp);
	++i;
    }
}
ivt.prototype.addrow = function()
{
    var rl = this.rows.length;
    var row = new Array()
    var row_oinfo = new Array();
    row.tmargin = 0;
    row.bmargin = 0;
    row.height = 20;
    this.rows.push(row);
    this.rows_oinfo.push(row_oinfo);
    this.addRowPUpto(rl + 1);
    return row;
}
//change column width if possible
ivt.prototype.maybeChangeColWidth = function(ci, cell)
{
    var tmp;
    var colp = this.colsp[ci];
    switch(this.sizetype)
    {
    case VTABLE_DYNAMIC:
	if((tmp = this.contentRequestedWidth(cell,colp.width))>colp.width)
	    colp.width = tmp;
	break;
    }
}
ivt.prototype.computeWidth = function()
{
    var ret = 0;
    var colp;
    var len = this.colsp.length;
    for(var i = 0; i < len; ++i)
    {
	colp = this.colsp[i];
	ret += colp.width + colp.lmargin + colp.rmargin;
    }
    return this.width = ret;
}
ivt.prototype.computeHeight = function()
{
    var ret = 0;
    var rowp;
    var len = this.rowsp.length;
    for(var i = 0; i < len; ++i)
    {
	rowp = this.rowsp[i];
	ret += rowp.height + rowp.tmargin + rowp.bmargin;
    }
    return this.height = ret;
}
ivt.prototype.foreachRow = function(p)
{
    var len = this.rows.length;
    for(var i = 0; i < len; ++i)
	p(rows[i]);
}
ivt.prototype.foreachColp = function(p)
{
    var len = this.colsp.length;
    for(var i = 0; i < len; ++i)
	p(this.colsp[i]);
}
ivt.prototype.contentRequestedWidth = function(){return 200;};
ivt.prototype.contentRequestedHeight = function(){return 20;};
// rows is an array of columns
ivt.prototype.x = 0;
ivt.prototype.y = 0;
ivt.prototype.rows;
ivt.prototype.colsp;
ivt.prototype.rowsp;
ivt.prototype.dir = ">";
ivt.prototype.span_method = "pc";
ivt.prototype.width = 0;
ivt.prototype.height = 0;
ivt.prototype.spaned;
ivt.prototype.sizetype = VTABLE_DYNAMIC;
}
inherit_vtable(vtable);
var vcell = function()
{
    
}
function inherit_vcell(nc)
{
    nc.prototype.ox = 0;
    nc.prototype.oy = 0;
    nc.prototype.owidth = 40;
    nc.prototype.oheight = 20;
    nc.prototype.cspan = 1;
    nc.prototype.rspan = 1;
    nc.prototype.content;
    nc.prototype.colnum;
    nc.prototype.rownum;
}
inherit_vcell(vcell);
var vcell_oinfo = function(cell)
{
    this.cell = cell;
}
function inherit_vcell_oinfo(nc)
{
    nc.prototype.cell;
    nc.prototype.x = 0;
    nc.prototype.y = 0;
    nc.prototype.width = 40;
    nc.prototype.height = 20;
    nc.prototype.rownum;
    nc.prototype.colnum;
}
inherit_vcell_oinfo(vcell_oinfo);
var vcolProperties = function()
{

}
vcolProperties.prototype.width = 100;
vcolProperties.prototype.rmargin = 0;
vcolProperties.prototype.lmargin = 0;

var vrowProperties = function()
{

}
vrowProperties.prototype.height = 30;
vrowProperties.prototype.tmargin = 0;
vrowProperties.prototype.bmargin = 0;
function vtable_setup2(vt)
{
    //same as setup but its implemented to be faster and safer
    //table must updated before this call
    var setup_func;
    switch(vt.dir)
    {
    case '>':
    case 'ltr':
	switch(vt.span_method)
	{
	case 'pc': // push columns
	    setup_func = vtable_ltr_setup;
	    break;
	case 'pr': // push rows 
	    setup_func = vtable_ltr_pr_setup;
	}
	break;
    case '<':
    case 'rtl':
	switch(vt.span_method)
	{
	case 'pc':
	    setup_func = vtable_rtl_setup;
	    break;
	case 'pr':
	    setup_func = vtable_rtl_pr_setup;
	    break;
	}
	break;
    }
    setup_func(vt);
}
function vtable_ltr_setup(vt)
{
    var row, colp, rowp, cell;
    var rlen = vt.rows.length;
    var clen;
    var c, i;
    var x, y = vt.y;
    for(var r = 0; r < rlen; ++r)
    {
	row = vt.rows[r];
	rowp = vt.rowsp[r];
	// update row moves
	y += rowp.tmargin;
	clen = row.length;
	c = 0;
	x = vt.x;
	for(i = 0; i < clen; ++i)
	{
	    while((colp = vt.colsp[c]) && vt.spaned[r][c])
	    {
		++c;
		// update spaned as well
		x += colp.width + colp.lmargin + colp.rmargin;
	    }
	    // update col moves
	    x += colp.lmargin;

	    cell = row[i];
	    var cell_oinfo = vt.rows_oinfo[r][i];
	    cell_oinfo.x = x;
	    cell_oinfo.y = y;
	    cell_oinfo.width = vtable_ltr_cell_find_width(vt, cell, c);
	    cell_oinfo.height = vtable_ltr_cell_find_height(vt, cell, r);

	    // deprecated output data remove later
	    cell.owidth = vtable_ltr_cell_find_width(vt, cell, c);
	    cell.oheight = vtable_ltr_cell_find_height(vt, cell, r);
	    cell.ox = x;
	    cell.oy = y;

	    // update col moves
	    x += colp.width + colp.rmargin;
	    ++c;
	}
	// update row moves
	y += rowp.height + rowp.bmargin;
    }
}
function vtable_ltr_pr_setup(vt)
{
    var row, colp, rowp, cell;
    var clen = vt.colsp.length;
    var rlen = vt.rows.length;
    var c, i;
    var x = vt.x, y;
    for(var c = 0; c < clen; ++c)
    {
	colp = vt.colsp[c];
	// update col moves
	x += colp.lmargin;
	y = vt.y;
	for(var i = 0, r = 0; i < rlen; ++i, ++r)
	{
	    while((rowp = vt.rowsp[r]) && vt.spaned[c][r])
	    {
		++r;
		// update spaned as well
		y += rowp.height + rowp.tmargin + rowp.bmargin;
	    }
	    //update row moves
	    y += rowp.tmargin;

	    cell = vt.rows[i][c];
	    if(cell)
	    {
		var cell_oinfo = vt.rows_oinfo[i][c];
		cell_oinfo.width = vtable_ltr_cell_find_width(vt, cell, c);
		cell_oinfo.height = vtable_ltr_cell_find_height(vt, cell, r);
		cell_oinfo.x = x;
		cell_oinfo.y = y;

		cell.owidth = vtable_ltr_cell_find_width(vt, cell, c);
		cell.oheight = vtable_ltr_cell_find_height(vt, cell, r);
		cell.ox = x;
		cell.oy = y;
	    }
	    
	    y += rowp.height + rowp.bmargin;
	}
	x += colp.width + colp.rmargin;
    }
}
function vtable_rtl_setup(vt)
{
    var row, colp, cell;
    var rlen = vt.rows.length;
    var clen;
    var c, i;
    var x, y = vt.y;
    vt.computeWidth();
    vt.computeHeight();
    for(var r = 0; r < rlen; ++r)
    {
	row = vt.rows[r];
	rowp = vt.rowsp[r]
	// update row moves
	y += rowp.tmargin;
	clen = row.length;
	c = 0;
	x = vt.x + vt.width;
	for(i = 0; i < clen; ++i)
	{
	    while((colp = vt.colsp[c]) && vt.spaned[r][c])
	    {
		++c;
		// update spaned as well
		x -= colp.width + colp.lmargin + colp.rmargin;
	    }
	    // update col moves
	    x -= colp.rmargin;

	    cell = row[i];
	    var cell_oinfo = vt.rows_oinfo[r][i];
	    cell_oinfo.width = vtable_rtl_cell_find_width(vt, cell, c);
	    cell_oinfo.height = vtable_rtl_cell_find_height(vt, cell, r);
	    cell_oinfo.x = x - cell_oinfo.width;
	    cell_oinfo.y = y;

	    cell.owidth = vtable_rtl_cell_find_width(vt, cell, c);
	    cell.oheight = vtable_rtl_cell_find_height(vt, cell, r);
	    cell.ox = x - cell.owidth;
	    cell.oy = y;

	    // update col moves
	    x -= colp.lmargin + colp.width;
	    ++c;
	}
	// update row moves
	y += rowp.height + rowp.bmargin;
    }
}
function vtable_rtl_pr_setup(vt)
{
    var row, colp, rowp, cell;
    var clen = vt.colsp.length;
    var rlen = vt.rows.length;
    var c, i;
    var y;
    var x = vt.x + vt.width;
    for(var c = 0; c < clen; ++c)
    {
	colp = vt.colsp[c];
	// update col moves
	x -= colp.lmargin;
	y = vt.y;
	for(var i = 0, r = 0; i < rlen; ++i, ++r)
	{

	    cell = vt.rows[i][c];
	    if(cell)
	    {
		while((rowp = vt.rowsp[r]) && vt.spaned[c][r])
		{
		    ++r;
		    // update spaned as well
		    y += rowp.height + rowp.tmargin + rowp.bmargin;
		}
		//update row moves
		y += rowp.tmargin;

		var cell_oinfo = vt.rows_oinfo[i][c];
		cell_oinfo.width = vtable_ltr_cell_find_width(vt, cell, c);
		cell_oinfo.height = vtable_ltr_cell_find_height(vt, cell, r);
		cell_oinfo.x = x - cell_oinfo.width;
		cell_oinfo.y = y;

		cell.owidth = vtable_ltr_cell_find_width(vt, cell, c);
		cell.oheight = vtable_ltr_cell_find_height(vt, cell, r);
		cell.ox = x - cell.owidth;
		cell.oy = y;
	    }
	    
	    y += rowp.height + rowp.bmargin;
	}
	x -= colp.width + colp.rmargin;
    }
}
function vtable_setup(vt)
{
    //table must updated before this call
    var row, cell;
    var rlen = vt.rows.length;
    var clen;
    var c, i;
    vt.computeWidth();
    vt.computeHeight();
    /*
    var spaned = new Array(rlen);
    for(i=0; i < rlen; ++i)
	spaned[i] = [];
*/
    var setpramfunc;
    switch(vt.dir)
    {
    case '>':
    case 'ltr':
	setpramfunc = vtable_ltr_setpram;
	break;
    case '<':
    case 'rtl':
	setpramfunc = vtable_rtl_setpram;
	break;
    }
    for(var r = 0; r < rlen; ++r)
    {
	row = vt.rows[r];
	clen = row.length;
	c = 0;
	for(i = 0; i < clen; ++i)
	{
	    while(vt.spaned[r][c])
	    {
		++c;
	    }
	    cell = row[i];
	    setpramfunc(vt, cell, c, r);
	    /*
	    for(var k = 0; k < cell.rspan; ++k)
		for(var z = 0; z < cell.cspan; ++z)
	    	    if(r + k < rlen)
			spaned[r + k][c + z] = true;
	    */
	    ++c;
	}
    }
}
function vtable_ltr_setpram(vt, cell, c, r)
{
    cell.ox = vtable_ltr_cell_find_x(vt, c);
    cell.oy = vtable_ltr_cell_find_y(vt, r);
    cell.owidth = vtable_ltr_cell_find_width(vt, cell, c);
    cell.oheight = vtable_ltr_cell_find_height(vt, cell, r);
}
function vtable_ltr_cell_find_x(vt, sc)
{
    var ret = 0;
    var colp;
    for(var i = 0; i < sc; ++i)
    {
	colp = vt.colsp[i];
	ret += colp.width +  colp.lmargin + colp.rmargin;
    }
    colp = vt.colsp[sc];
    ret += colp.lmargin;
    return ret;
}
function vtable_ltr_cell_find_y(vt, r)
{
    var ret = 0;
    var row;
    for(var i = 0; i < r; ++i)
    {
	row = vt.rows[i];
	ret += row.height + row.tmargin + row.bmargin;
    }
    row = vt.rows[r];
    ret += row.tmargin;
    return ret;
}
function vtable_ltr_cell_find_width(vt, cell, c)
{
    var ret = 0;
    var colp;
    if(cell.cspan < 2)
	return vt.colsp[c].width;

    colp = vt.colsp[c];
    ret += colp.width + colp.rmargin;
    for(var i = 1; i < cell.cspan - 1; ++i)
    {
	colp = vt.colsp[c + i];
	ret += colp.width + colp.lmargin + colp.rmargin;
    }
    colp = vt.colsp[c + i];
    ret += colp.width + colp.lmargin;
    return ret;
}
function vtable_ltr_cell_find_height(vt, cell, r)
{
    var ret = 0;
    var rowp;
    if(cell.rspan < 2)
	return vt.rowsp[r].height;
    rowp = vt.rowsp[r];
    ret	+= rowp.height + rowp.bmargin;
    for(var i = 1; i < cell.rspan - 1; ++i)
    {
	rowp = vt.rowsp[r + i];
	if(rowp)
	    ret	+= rowp.height + rowp.tmargin + rowp.bmargin;
	else // end of rows
	    return ret - vt.rowsp[r + i - 1].bmargin;
    }
    rowp = vt.rowsp[r + i];
    if(rowp)
	ret += rowp.height + rowp.tmargin;
    else
	return ret - vt.rowsp[r + i - 1].bmargin;
    return ret;
}
function vtable_rtl_setpram(vt, cell, c, r)
{
    cell.owidth = vtable_rtl_cell_find_width(vt, cell, c);
    cell.oheight = vtable_rtl_cell_find_height(vt, cell, r);
    cell.ox = vtable_rtl_cell_find_x(vt, c, cell.owidth);
    cell.oy = vtable_rtl_cell_find_y(vt, r);
}
function vtable_rtl_cell_find_x(vt, sc, w)
{
    var ret = vt.width - w;
    var colp;
    for(var i = 0; i < sc; ++i)
    {
	colp = vt.colsp[i];
	ret -= colp.width +  colp.lmargin + colp.rmargin;
    }
    colp = vt.colsp[sc];
    ret -= colp.rmargin;
    return ret;  
}
var vtable_rtl_cell_find_y = vtable_ltr_cell_find_y;
function vtable_rtl_cell_find_width(vt, cell, c)
{
    var ret = 0;
    var colp;
    if(cell.cspan < 2)
	return vt.colsp[c].width;

    colp = vt.colsp[c];
    ret += colp.width + colp.lmargin;
    for(var i = 1; i < cell.cspan - 1; ++i)
    {
	colp = vt.colsp[c + i];
	ret += colp.width + colp.lmargin + colp.rmargin;
    }
    colp = vt.colsp[c + i];
    ret += colp.width + colp.rmargin;
    return ret;
}
var vtable_rtl_cell_find_height = vtable_ltr_cell_find_height;
function vtable_update(vt)
{
    var update_func;
    switch(vt.span_method)
    {
    case 'pc': // push columns
	update_func = vtable_pc_update;
	break;
    case 'pr': // push rows 
	update_func = vtable_pr_update;
    }
    vt.clearSpaned();
    return update_func(vt);
}
function vtable_update_noclear(vt)
{
    var update_func;
    switch(vt.span_method)
    {
    case 'pc': // push columns
	update_func = vtable_pc_update;
	break;
    case 'pr': // push rows 
	update_func = vtable_pr_update;
    }
    return update_func(vt);
}
function vtable_pc_update(vt)
{
    var row, cell;
    var rlen = vt.rows.length;
    var clen;
    var c, i;
    vt.addRowPUpto(rlen);
    vt.updateSpaned();
    for(var r = 0; r < rlen; ++r)
    {
	row = vt.rows[r];
	clen = row.length;
	c = 0;
	for(i = 0; i < clen; ++i)
	{
	    while(vt.spaned[r][c])
		++c;
	    cell = row[i];
	    vt.addColPUpto(c + cell.cspan);
	    cell.colnum = c;
	    cell.rownum = r;
	    var cell_oinfo = vt.rows_oinfo[r][i];
	    cell_oinfo.rownum = r;
	    cell_oinfo.colnum = c;
	    vt.maybeChangeColWidth(c, cell);
	    var z = 1;
	    for(var k = 0; k < cell.rspan; ++k)
	    {
		for(; z < cell.cspan; ++z)
	    	    if(r + k < rlen)
			vt.spaned[r + k][c + z] = true;
		z = 0;
	    }
	    ++c;
	}
    }
    vt.computeWidth();
    vt.computeHeight();
}
function vtable_pr_update(vt)
{
    var row, cell;
    var rlen = vt.rows.length;
    var clen = vt.colsp.length;
    var i, r;
    vt.addColPUpto(clen);
    vt.updateSpaned();
    for(var c = 0; c < clen; ++c)
    {
	for(i = 0, r = 0; i < rlen; ++i, ++r)
	{
	    while(vt.spaned[c][r])
		++r;
	    cell = vt.rows[i][c];
	    if(cell)
	    {
		vt.addRowPUpto(r + cell.rspan);
		vt.maybeChangeColWidth(c, cell);
		cell.colnum = c;
		cell.rownum = r;
		var cell_oinfo = vt.rows_oinfo[i][c];
		cell_oinfo.rownum = r;
		cell_oinfo.colnum = c;
		var z = 1;
		for(var k = 0; k < cell.rspan; ++k)
		{
		    for(; z < cell.cspan; ++z)
	    		if(r + k < rlen)
			    vt.spaned[c + z][r + k] = true;
		    z = 0;
		}
	    }
	}
    }
    vt.computeWidth();
    vt.computeHeight();
}
function vtable_update2(vt)
{
    var clen;
    var row, rowpos = 0;
    var c, r;
    var len = vt.rows.length;
    var pushCol = new Array(len);
    for(r = 0; r < len; ++r)
	pushCol[r] = 0;    
    r = 0;
    while(r < len)
    {
	row = vt.rows[r];
	clen = row.length;
	for(c = 0; c < clen; ++c)
	{
	    var cell = row[c];
	    vt.addColPUpto(pushCol[r] + cell.cspan);
	    //cell.content.innerHTML = pushCol[r];
	    for(var k = 0; k < cell.cspan; ++k)
	    {
		vt.maybeChangeColWidth(pushCol[r] + k, cell);
	    }
	    var trow;
	    for(var k = 0; k < cell.rspan; ++k)
	    {
		trow = vt.rows[r + k];
		if(trow)
		{
		    for(var z = 0; z < cell.cspan; ++z)
		    {
			
		    }
		    pushCol[r + k] += cell.cspan;
		}
	    }
	}
	++r;
    }
}
function vtable_foreach_cell(vt, p)
{
    var rlen = vt.rows.length;
    var clen;
    var row;
    var c;
    for(var r = 0; r < rlen; ++r)
	for(row = vt.rows[r], c = 0, clen = row.length; c < clen; ++c)
	    p(row[c]);
}
function vtable_foreach_cell_oinfo(vt, p)
{
    var rlen = vt.rows_oinfo.length;
    var clen;
    var row;
    var c;
    for(var r = 0; r < rlen; ++r)
	for(row = vt.rows_oinfo[r], c = 0, clen = row.length; c < clen; ++c)
	    p(row[c]);
}