/*
 * Visual Table does simple table look by positioning his cells
 *   Copyright (C) 2012  Hossein Amin
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
  Directional Fixed Size(uniform cells) Table
  is an abstraction on vtable which manages sizes and cell positioning
  in specific direction
*/
var dfstable = function(width, height, hbc, vbc, hbm, vbm)
{
    this.vtable_construct();
    if(width)
	this.width = width;
    if(height)
	this.height = height;
    if(hbc)
	this.hbc = hbc;
    if(vbc)
	this.vbc = vbc;
    if(hbm)
	this.hbmargin = hbm;
    if(vbm)
	this.vbmargin = vbm;
    this.initTable();
}
// inherit vtable
inherit_vtable(dfstable);
// horizontal block count property
dfstable.prototype.hbc = 1;
// vertical block count property
dfstable.prototype.vbc = 1;
// dfstable not support pr mode 
dfstable.prototype.span_method = 'pc';
dfstable.prototype.install_dir = 'ttb';
dfstable.prototype.hbmargin = 0;
dfstable.prototype.vbmargin = 0;
dfstable.prototype.bsw = 0;
dfstable.prototype.bsh = 0;
dfstable.prototype.tbcount = 0;
//dfstable.prototype.cells = new Array(0);
dfstable.prototype.sizetype = VTABLE_FIXED;
dfstable.prototype.spanedSlotCount = 0;
dfstable.prototype.pushr = 0;
dfstable.prototype.pushrp = 0;
dfstable.prototype.pushc = 0;
dfstable.prototype.inst_spaned;
dfstable.prototype.vtable_addcell = dfstable.prototype.addcell;
dfstable.prototype.pushcell = function(cell)
{
    var addcell_func;
    switch(this.install_dir)
    {
    case 'ttb':
	addcell_func = dfstable_ttb_pushcell;
	break;
    default:
	return;
    }
    return addcell_func(this, cell);
}
dfstable.prototype.pushcell_strict = function(cell)
{
    var addcell_func;
    switch(this.install_dir)
    {
    case 'ttb':
	addcell_func = dfstable_ttb_pushcell_strict;
	break;
    default:
	return;
    }
    return addcell_func(this, cell);
}
dfstable.prototype.vtable_popcell = dfstable.prototype.popcell;
dfstable.prototype.popcell = function(cell)
{

    var popcell_func;
    switch(this.install_dir)
    {
    case 'ttb':
	popcell_func = dfstable_ttb_popcell;
	break;
    default:
	return;
    }
    return popcell_func(this, cell);
}
dfstable.prototype.get_push_available_slots = function()
{
    var p;
    switch(this.install_dir)
    {
    case 'ttb':
	p = dfstable_ttb_get_push_avail_slots;
	break;
    default:
	return;
    }
    return p(this);
}
dfstable.prototype.isTableFull = function()
{
    var p;
    switch(this.install_dir)
    {
    case 'ttb':
	p = dfstable_ttb_isTableFull;
	break;
    }
    return p(this);
}
function dfstable_ttb_get_push_avail_slots_lrow_mcol(dt, rrem, crem)
{
    /*
     * found how much row available slot is in 
     * which has least row and most column slots
     */
    var spaned = dt.inst_spaned;
    var brk;
    for(var k = 1; k < rrem; ++k)
    {
	for(var z = 0; z < crem; ++z)
	    if(spaned[dt.pushr + k][dt.pushc + z] != DFSTABLE_CELL_EMPTY)
	    {
		rrem = k;
		brk = true;
		break;
	    }
	if(brk == true)
	    break;
    }
    for(var k = 0; k < rrem; ++k)
    {
	for(var z = 0; z < crem; ++z)
	    if(spaned[dt.pushr + k][dt.pushc + z] != DFSTABLE_CELL_EMPTY)
	    {
		if(crem > z)
		    crem = z;
	    }
    }
    return [ rrem , crem ];
}
function dfstable_ttb_get_push_avail_slots_mrow_lcol(dt, rrem, crem)
{
    /*
     * found how much row available slot is in 
     * which has most row and least column slots
     */
    var spaned = dt.inst_spaned;
    var brk;
    for(var k = 1; k < crem; ++k)
    {
	for(var z = 0; z < rrem; ++z)
	    if(spaned[dt.pushr + z][dt.pushc + k] != DFSTABLE_CELL_EMPTY)
	    {
		crem = k;
		brk = true;
		break;
	    }
	if(brk == true)
	    break;
    }
    for(var k = 0; k < rrem; ++k)
    {
	for(var z = 0; z < crem; ++z)
	    if(spaned[dt.pushr + k][dt.pushc + z] != DFSTABLE_CELL_EMPTY)
	    {
		if(rrem > k)
		    rrem = k;
	    }
    }
    return [ rrem , crem ];
}
function dfstable_ttb_get_push_avail_slots(dt)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var pr = dt.pushr;
    var pc = dt.pushc;
    var spaned = dt.inst_spaned;
    if(dt.pushc >= clen)
	return [ 0 , 0 ];
    var re;
    switch((re = dfstable_ttb_forward_empty(dt)))
    {
    case DFSTABLE_TABLE_FULL:
	return [ 0 , 0 ];
	break
    }
    var crem = clen - dt.pushc;
    var rrem = rlen - dt.pushr;
    // available slots could be more than one case
    var res = dfstable_ttb_get_push_avail_slots_lrow_mcol(dt, rrem, crem);
    var res2 = dfstable_ttb_get_push_avail_slots_mrow_lcol(dt, rrem, crem);
    if(res[0] * res[1] < res2[0] * res2[1])
	res = res2;
/*
    for(var k = 0; k < rrem; ++k)
    {
	if(spaned[dt.pushr + k][dt.pushc] != DFSTABLE_CELL_EMPTY)
	    rrem = k;
    }
*/
    return res;
}
function dfstable_ttb_backward_filled(dt)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var spaned = dt.inst_spaned;
    do
    {
	if(dt.pushr <= 0)
	{
	    --dt.pushc;
	    if(dt.pushc < 0)
		return DFSTABLE_TABLE_EMPTY;
	    dt.pushr = rlen;
	}
    }while(spaned[--dt.pushr][dt.pushc] != DFSTABLE_CELL_FILLED);
    return 0;
}
function dfstable_free_slot(dt, cell)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var spaned = dt.inst_spaned;
    for(var k = 0; k < cell.rspan; ++k)
	for(var z = 0; z < cell.cspan; ++z)
	    if(dt.pushr + k < rlen)
		spaned[dt.pushr + k][dt.pushc + z] = DFSTABLE_CELL_EMPTY;
}
function dfstable_ttb_popcell(dt, cell)
{
    try{
    if(dt.pushr <= 0 && dt.pushc < 0)
	return DFSTABLE_TABLE_EMPTY;
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var spaned = dt.inst_spaned;
    var re;
    if((re = dfstable_ttb_backward_filled(dt)) != 0)
	return re;
    var cell;
    cell = dt.vtable_popcell(dt.pushr);
    dfstable_free_slot(dt, cell);
    return cell;
    }
    catch(err)
    {
	alert("pop cell!!: "+cell+" pushrc: "+ dt.pushr+"x"+dt.pushc +
	      " spaned: " +spaned[dt.pushr][dt.pushc] +" error: "+ err);
    }
}
var DFSTABLE_CELL_EMPTY = 0;
var DFSTABLE_CELL_FILLED = 1;
var DFSTABLE_CELL_SPANED = 2;

var DFSTABLE_ADD_SUCCESS = 0;
var DFSTABLE_TABLE_FULL = 1;
var DFSTABLE_TABLE_EMPTY = 5;
var DFSTABLE_WONT_FIT_IN_COL = 2;
var DFSTABLE_WONT_FIT_IN_ROW = 3;
var DFSTABLE_WONT_FIT = 4;
function dfstable_ttb_pushcell(dt, cell)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    if(dt.pushc >= clen)
	return DFSTABLE_TABLE_FULL;
    while(dt.inst_spaned[dt.pushr][dt.pushc] != DFSTABLE_CELL_EMPTY)
	if(++dt.pushr >= rlen)
        {
	    dt.pushr = 0;
	    ++dt.pushc;
	    if(dt.pushc >= clen)
		return DFSTABLE_TABLE_FULL;
	    //break;
	}
    if(cell.rspan > rlen - dt.pushr)
	cell.rspan = rlen - dt.pushr;
    dt.vtable_addcell(dt.pushr, cell);
    var z = 1
    dt.inst_spaned[dt.pushr][dt.pushc] = DFSTABLE_CELL_FILLED;
    for(var k = 0; k < cell.rspan; ++k)
    {
	for(; z < cell.cspan; ++z)
	    if(dt.pushr + k < rlen)
		dt.inst_spaned[dt.pushr + k][dt.pushc + z] = 
	    						DFSTABLE_CELL_SPANED;
	z = 0;
    }
    ++dt.pushr;
    if(dt.pushr >= rlen)
    {
	dt.pushr = 0;
	++dt.pushc;
    }
    return DFSTABLE_ADD_SUCCESS;
}
function dfstable_ttb_forward_empty(dt)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var spaned = dt.inst_spaned;
    while(spaned[dt.pushr][dt.pushc] != DFSTABLE_CELL_EMPTY)
	if(++dt.pushr >= rlen)
        {
	    dt.pushr = 0;
	    ++dt.pushc;
	    if(dt.pushc >= clen)
		return DFSTABLE_TABLE_FULL;
	    // break was here
	}
    return 0;
}
function dfstable_ttb_possible_to_push(dt, cell)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var cdef = clen - dt.pushc;
    var rdef = rlen - dt.pushr;
    var spaned = dt.inst_spaned;
    if(cell.cspan > cdef && cell.rspan > rdef)
	return DFSTABLE_WONT_FIT;
    else if(cell.cspan > cdef)
	return DFSTABLE_WONT_FIT_IN_COL;
    else if(cell.rspan > rdef)
	return DFSTABLE_WONT_FIT_IN_ROW;
    var z = 1;
    for(var k = 0; k < cell.rspan; ++k)
    {
	for(; z < cell.cspan; ++z)
	    if(dt.pushr + k < rlen)
		if(spaned[dt.pushr + k][dt.pushc + z] != DFSTABLE_CELL_EMPTY)
		    return DFSTABLE_WONT_FIT;
	z = 0;
    }
    return 0;
}
function dfstable_ttb_fill_slots(dt, cell)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var spaned = dt.inst_spaned;
     spaned[dt.pushr][dt.pushc] = DFSTABLE_CELL_FILLED;
    var z = 1;
    for(var k = 0; k < cell.rspan; ++k)
    {
	for(; z < cell.cspan; ++z)
	    if(dt.pushr + k < rlen)
		spaned[dt.pushr + k][dt.pushc + z] = DFSTABLE_CELL_SPANED;
	z = 0;
    }
}
function dfstable_ttb_pushcell_strict(dt, cell)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var pr = dt.pushr;
    var pc = dt.pushc;
    var spaned = dt.inst_spaned;
    if(dt.pushc >= clen)
	return DFSTABLE_TABLE_FULL;
    var re;
    if((re = dfstable_ttb_forward_empty(dt)) != 0)
	return re;
    if((re = dfstable_ttb_possible_to_push(dt, cell)) != 0)
	return re;
    dt.vtable_addcell(dt.pushr, cell);
    dfstable_ttb_fill_slots(dt, cell);
    ++dt.pushr;
    if(dt.pushr >= rlen)
    {
	dt.pushr = 0;
	++dt.pushc;
    }
    return DFSTABLE_ADD_SUCCESS;
}
function dfstable_ttb_isTableFull(dt)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    if(dt.pushc >= clen)
	return true;
    while(dt.inst_spaned[dt.pushr][dt.pushc] != DFSTABLE_CELL_EMPTY)
	if(++dt.pushr >= rlen)
        {
	    dt.pushr = 0;
	    ++dt.pushc;
	    if(dt.pushc >= clen)
		return true;
	}
    return false;
}
dfstable.prototype.initTable = function()
{
    //this.computeTableBlocksCount();
    //this.computeVBMargin();
    //this.computeHBMargin();
    this.computeBlockWidth();
    this.computeBlockHeight();
    this.tbcount = this.hbc * this.vbc;
    var clen = this.hbc;
    var rlen = this.vbc;
    for(var k = 0; k < rlen; ++k)
	this.addrow();
    this.updateSpaned();
    this.inst_spaned = new Array(rlen);
    for(var i = 0; i < rlen; ++i)
    {
	this.inst_spaned[i] = new Array(clen);
	for(var k = 0; k < clen; ++k)
	    this.inst_spaned[i][k] = DFSTABLE_CELL_EMPTY;
    }

}
dfstable.prototype.install = function()
{
    var install_func;
    switch(this.install_dir)
    {
    case "ttb":
	install_func = dfstable_ttb_install;
	break;
    default:
	return;
    }
    install_func(this);
}
dfstable_ttb_install = function(dt)
{
    var rlen = dt.vbc;
    var clen = dt.hbc;
    var ilen = dt.cells.length;
    dt.inst_spaned = new Array(rlen);
    for(i=0; i < rlen; ++i)
	dt.inst_spaned[i] = new Array(clen);
    var row, cell;
    var i = 0;
    var rbrk = false;
    for(var c = 0; c < clen; ++c)
    {
	for(var r = 0; r < rlen && i < ilen; ++r)
	{
	    while(dt.inst_spaned[r][c])
		if(++r >= rlen)
	        {
		    rbrk = true;
		    break;
	        }
	    if(rbrk == true)
	    {
		rbrk = false;
		break;
	    }
	    Cell = dt.cells[i++];
	    if(cell.cspan > clen - c)
		cell.cspan = clen - c;
	    dt.vtable_addcell(r, cell);
	    //++i;
	    for(var k = 0; k < cell.rspan; ++k)
		for(var z = 0; z < cell.cspan; ++z)
	    	    if(r + k < rlen)
			dt.inst_spaned[r + k][c + z] = true;
	}
    }
}
dfstable.prototype.vtable_update = dfstable.prototype.update;
dfstable.prototype.update = function()
{
    var colp;
    var len = this.hbc
    var bsw = this.bsw;
    var bsh = this.bsh;
    var hbmargin = this.hbmargin;
    var vbmargin = this.vbmargin;
    this.addColPUpto(len);
    for(var i = 0; i < len; ++i)
    {
	colp = this.colsp[i];
	colp.width = bsw;
	colp.lmargin = colp.rmargin = hbmargin / 2;
    }
    len = this.rowsp.length;
    var rowp;
    for(var i = 0; i < len; ++i)
    {
	rowp = this.rowsp[i];
	rowp.height = bsh;
	rowp.tmargin = rowp.bmargin = vbmargin / 2;
    }
    this.vtable_update();
}
dfstable.prototype.computeBlockWidth = function()
{
    return this.bsw = this.width / this.hbc - this.hbmargin;
}
dfstable.prototype.computeBlockHeight = function()
{
    return this.bsh = this.height / this.vbc - this.vbmargin;
}
dfstable.prototype.computeTableBlocksCount = function()
{
    var hb = this.computeHBlocksInTable();
    var vb = this.computeVBlocksInTable();
    return this.tbcount = hb * vb;
}
dfstable.prototype.computeHBlocksInTable = function()
{
    var m;
    var ts = this.width;
    var cs = this.bsw;
    return this.hbc = Math.floor(ts / cs);
}
dfstable.prototype.computeVBlocksInTable = function()
{
    var ts = this.height;
    var cs = this.bsh;
    return this.vbc = Math.floor(ts / cs);
}
dfstable.prototype.computeVBMargin = function()
{
    var ts = this.height;
    var cs = this.bsh;
    var bcount = this.vbc;
    return this.vbmargin = ts / bcount - cs;
}
dfstable.prototype.computeHBMargin = function()
{
    var ts = this.width;
    var cs = this.bsw;
    var bcount = this.hbc;
    return this.hbmargin = ts / bcount - cs;
}
dfstable.prototype.foreachUIntsCell = function(p)
{
    var len = this.cells.length;
    for(var i = 0; i < len; ++i)
    {
	p(this.cells[i]);
    }    
}
dfstable.prototype.spanSlot = function(r, c)
{
    var ispan = this.inst_spaned;
    var vspan = this.spaned;
    if(this.span_method == 'pr')
	return false; // pr not supported
    if(ispan[r][c] == DFSTABLE_CELL_EMPTY &&
       vspan[r][c] !== true)
    {
	ispan[r][c] = DFSTABLE_CELL_SPANED;
	vspan[r][c] = true;
	++this.spanedSlotCount;
	return true;
    }
    return false;
}
dfstable.prototype.ispossible_push_to_table = function(cell)
{
    
}
dfstable.prototype.ispossible_push_to_row = function(cell)
{
    
}
dfstable.prototype.ispossible_push_to_col = function(cell)
{
    
}
dfstable.prototype.find_possible_table_to_push = function(cell)
{
    
}
dfstable.prototype.find_possible_row_to_push = function(cell)
{
    
}
dfstable.prototype.find_possible_cell_to_push = function(cell)
{
    
}
var docell = function()
{
}
function inherit_docell(cls)
{
    inherit_vcell(cls);
}
inherit_docell(docell);
