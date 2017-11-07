import React,{Component} from 'react';
import {connect} from 'react-redux';
import GambarLoading from '../../Imgs/loading.gif';
import $ from 'jquery';
//const $ = require('jquery');
$.DataTable = require('datatables.net');

@connect((store)=>{
	return {
		data : store.dashBoard.pageData,
		page: store.dashBoard.page,
		accesstoken: store.loginInfo.accesstoken,
		permission: store.dashBoard.pagePermission,
	};
})
export class MasterSatuan extends Component{
	componentWillUnmount(){
       $('#tempat-table-crud table').DataTable().destroy(true);
       $(document).off('click','[data-tombol]');
       $(document).off('submit','form[data-tombol="form"]');
    }
    constructor(){
    	super();
    	this.totalTabel = 0;
    	this.searchQuery = '';
    	this.dataTable = {};
    	window.helmi.that = this;
    }
	componentDidMount() {
        this.setDataTable();
        $(document).on('click','[data-tombol]',function(e){
       		e.preventDefault();
       		var {that} = window.helmi ;
       		switch($(this).attr('data-tombol')){
       			case 'tambah':
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						if(!that.props.permission.create){
       							$('button[data-tombol="simpan"]').attr('disabled','disabled');
       							$('.modal form input').attr('readonly','readonly');
       						}       						
       					});
       				break;
       			case 'hapus':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('delete');
       						$('.modal form [name="id_satuan"]').val($(this).attr('data-id'));
       						$('.modal-title h4').text('Delete '+ $(this).attr('data-id') );
       						$('.modal form input').attr('readonly','readonly');
       						$('button[data-tombol="simpan"]').text('DELETE');
       					});
       					
       				}
       				break;
       			case 'update':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('update');
       						$('.modal form input').attr('readonly','readonly');
       						$.ajax({
       							url: window.helmi.api + that.props.page,
       							data:{id_satuan:$(this).attr('data-id'),accesstoken:that.props.accesstoken},
       							type:'POST',dataType:'json',
       							success:function(resp){
       							try{
       								if(resp.data){
       									let {data} = resp;
       									$('.modal form input').removeAttr('readonly');
       									for( var k in data[0]){
       										$('.modal form [name="'+k+'"]').val(data[0][k]);
       									}
       								}
       							}catch(e){}
       								
       							}
       						});
       						
       						$('.modal-title h4').text('Update '+ $(this).attr('data-id') );
       						$('button[data-tombol="simpan"]').text('UPDATE').removeClass('btn-danger').addClass('btn-info');
       					});
       					
       				}
       				break;
       			case 'simpan': $('form[data-tombol="form"]').trigger('submit'); break;
       			default:break;
       		}
       });
        $(document).on('submit','form[data-tombol="form"]',function(e){
       		let data ={
       			nama_satuan:$('.modal form [name="nama_satuan"]').val() ,
       			id_satuan:$('.modal form [name="id_satuan"]').val() ,
       			mode:$('.modal form [name="mode"]').val() ,
       		};
       		var {that} = window.helmi ;
       		data = {...data,accesstoken:that.props.accesstoken};
       		$.ajax({
       			url: window.helmi.api + that.props.page +'/insert_update_delete',
       			data,
       			type:'POST',dataType:'json',
       			success:(resp)=>{
       				if(resp.success && resp.message ){
       					if(resp.total){
       						that.totalTabel += parseInt(resp.total,10) ;
       					}
       					$('.modal #pesan-error').html(`
             				<div class="alert alert-success"><strong>Success : </strong>${resp.message}</div>\
             			`);
             			setTimeout(()=>{
             				that.props.dispatch({type:'TOGGLE_MODAL',value:'false'});
             				that.dataTable.ajax.reload(null, false);
             				//that.setDataTable();
             			},1000);
       				}
       			},
       			error:function(xhr){
       				if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error){
             				$('.modal #pesan-error').html(`
             					<div class="alert alert-danger"><strong>Error : </strong>${xhr.responseJSON.error}</div>
             				`);
             			}
             		}
       			},beforeSend:function(){
       				$('.modal [data-tombol]').attr('disabled','disabled');
       			},complete:function(){
       				$('.modal [data-tombol]').removeAttr('disabled');
       			}
       		});
       		e.preventDefault();
       		
       });

       this.props.dispatch({
       	type:'UPDATE_MODAL_BODY',value:{
       		body:`<div class="row"><form data-tombol="form">
       				<div class="input-group">
       					<label class="input-group-addon">Nama Satuan
		                    <span class="required"> * </span>
		                </label>
		                <input type="text" class="form-control" data-value="nama_satuan" name="nama_satuan"  />
		                <input type="hidden" data-value="id_satuan" name="id_satuan"  />
		                <input type="hidden" name="mode"  />
       				</div>
       			  </form></div><div style="margin-top:15px;" id="pesan-error"></div>`,
       		header:'<h4>Tambah Satuan</h4>',
       		footer:'<button class="btn btn-danger pull-left" data-tombol="simpan">Kirim</button>',
       	}
       });
    }

    tampilModal(){
    	this.props.dispatch({
    		type:'TOGGLE_MODAL',value:true
    	});
    }

    setDataTable(){
    	var {that} = window.helmi ;
    	this.dataTable = $('#tempat-table-crud table').DataTable({
        	 destroy: true,
             processing: true,
             serverSide: true,
             searching: false,
             ajax: {
             	url: window.helmi.api + that.props.page ,
             	data:function(d){
             		d.accesstoken = that.props.accesstoken;
             		d.totalrow = that.totalTabel;
             		d.cari = that.searchQuery;
             	},
             	type: "POST",
             	complete:function(){
             		$('#loading-image').hide();
             	},
             	error:function(xhr){
             		let errorMsg = {error:'Error Load Data',code:503}
             		if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error)errorMsg.error = xhr.responseJSON.error;
             			if(typeof xhr.responseJSON.accesstoken !== 'undefined'){
             				that.props.dispatch({
             					type:'CHANGE_ACCESSTOKEN',value:xhr.responseJSON.accesstoken
             				});
             			}
             		}
             		that.props.dispatch({
             			type:'PAGE_ERROR',value:errorMsg
             		});
             	},
             	dataSrc:(json)=>{
             		if(json.recordsTotal){
             			that.totalTabel = json.recordsTotal;
             		}
             		
             		var baru = [];
             		const {data} = json;
             		for ( var i=0; i < data.length ; i++ ) {
             			var no=0; baru[i]=[];
             			for(var k in data[i] ){
             				baru[i][no] = data[i][k]; 
             				no++;
             			}
             			baru[i][no]='';
             			if(that.props.permission.delete){
             				baru[i][no] +=`<button class="btn btn-action btn-danger" data-id="${data[i].id_satuan}" data-tombol="hapus"><i class="fa fa-times"></i></button>`;
             			}
             			if(that.props.permission.update){
             				baru[i][no] += `<button class="btn btn-action btn-info" data-id="${data[i].id_satuan}" data-tombol="update"><i class="fa fa-gear"></i></button>`;
             			}
				    }
			      return baru;
			    }
             },
             columns:[
             	{name: "id_satuan",searchable: false,  className: "text-center", width: "5%"},
             	{name: "nama_satuan",orderable:false},
             	{name: "action",orderable: false,searchable: false, className: "text-center", width: "15%"}
             ],
             bStateSave:true,
             //pagingType:'bootstrap_extended'
        });
    }
    
    shouldComponentUpdate() {
        return false;
    }

	render(){
		return(
			<div className="col-lg-12">
				<div className="row">
					<div className="col-lg-12">
						<ol className="breadcrumb">
							<li><a >Home</a></li>
							<li className="active"><span>Master Data </span></li>
						</ol>
					<h1>Satuan </h1>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 main-box"> 
						<header className="main-box-header clearfix">
							<h2 className="pull-left">Satuan </h2>
							<div className="filter-block pull-right">
							<a className="btn btn-primary pull-right" data-tombol="tambah">
								<i className="fa fa-plus-circle fa-lg"></i> Tambah Satuan
							</a>
							</div>
						</header>
						<div id="tempat-total-table" className="main-box-body clearfix"></div>
						<div className="main-box-body">
							<div id="tempat-table-crud">
								<table className="table table-striped table-bordered table-hover table-checkable order-column" >
									<thead>
										<tr>
											<th> No </th>
											<th> Nama Kategori Barang </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							<div id="loading-image" style={{textAlign:'center', minHeight:'150px'}}>
								<img src={GambarLoading} alt="Loading...." />
							</div>
							</div>
						</div> 
					</div>
				</div>
			</div>
		);
	}
}
/*===================================================================================================================*/
@connect((store)=>{
	return {
		data : store.dashBoard.pageData,
		page: store.dashBoard.page,
		accesstoken: store.loginInfo.accesstoken,
		permission: store.dashBoard.pagePermission,
	};
})
export class MasterTipe extends Component{
	tampilModal(){
    	this.props.dispatch({
    		type:'TOGGLE_MODAL',value:true
    	});
    }
    shouldComponentUpdate() {
        return false;
    }
    componentWillUnmount(){
       $('#tempat-table-crud table').DataTable().destroy(true);
       $(document).off('click','[data-tombol]');
       $(document).off('submit','form[data-tombol="form"]');
    }
    constructor(){
    	super();
    	this.totalTabel = 0;
    	this.searchQuery = '';
    	this.dataTable = {};
    	window.helmi.that = this;
    }
    componentDidMount() {
    	$(document).on('click','[data-tombol]',function(e){
       		e.preventDefault();
       		var {that} = window.helmi ;
       		switch($(this).attr('data-tombol')){
       			case 'tambah':
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						if(!that.props.permission.create){
       							$('button[data-tombol="simpan"]').attr('disabled','disabled');
       							$('.modal form input').attr('readonly','readonly');
       						}       						
       					});
       				break;
       			case 'hapus':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('delete');
       						$('.modal form [name="id_tipe"]').val($(this).attr('data-id'));
       						$('.modal-title h4').text('Delete '+ $(this).attr('data-id') );
       						$('.modal form input').attr('readonly','readonly');
       						$('button[data-tombol="simpan"]').text('DELETE');
       					});
       					
       				}
       				break;
       			case 'update':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('update');
       						$('.modal form input').attr('readonly','readonly');
       						$.ajax({
       							url: window.helmi.api + that.props.page,
       							data:{id_tipe:$(this).attr('data-id'),accesstoken:that.props.accesstoken},
       							type:'POST',dataType:'json',
       							success:function(resp){
       							try{
       								if(resp.data){
       									let {data} = resp;
       									$('.modal form input').removeAttr('readonly');
       									for( var k in data[0]){
       										$('.modal form [name="'+k+'"]').val(data[0][k]);
       									}
       								}
       							}catch(e){}
       								
       							}
       						});
       						
       						$('.modal-title h4').text('Update '+ $(this).attr('data-id') );
       						$('button[data-tombol="simpan"]').text('UPDATE').removeClass('btn-danger').addClass('btn-info');
       					});
       					
       				}
       				break;
       			case 'simpan': $('form[data-tombol="form"]').trigger('submit'); break;
       			default:break;
       		}
       });
        $(document).on('submit','form[data-tombol="form"]',function(e){
       		let data ={
       			nama_tipe:$('.modal form [name="nama_tipe"]').val() ,
       			id_tipe:$('.modal form [name="id_tipe"]').val() ,
       			mode:$('.modal form [name="mode"]').val() ,
       		};
       		var {that} = window.helmi ;
       		data = {...data,accesstoken:that.props.accesstoken};
       		$.ajax({
       			url: window.helmi.api + that.props.page +'/insert_update_delete',
       			data,
       			type:'POST',dataType:'json',
       			success:(resp)=>{
       				if(resp.success && resp.message ){
       					if(resp.total){
       						that.totalTabel += parseInt(resp.total,10) ;
       					}
       					$('.modal #pesan-error').html(`
             				<div class="alert alert-success"><strong>Success : </strong>${resp.message}</div>\
             			`);
             			setTimeout(()=>{
             				that.props.dispatch({type:'TOGGLE_MODAL',value:'false'});
             				that.dataTable.ajax.reload(null, false);
             			},1000);
       				}
       			},
       			error:function(xhr){
       				if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error){
             				$('.modal #pesan-error').html(`
             					<div class="alert alert-danger"><strong>Error : </strong>${xhr.responseJSON.error}</div>
             				`);
             			}
             		}
       			},beforeSend:function(){
       				$('.modal [data-tombol]').attr('disabled','disabled');
       			},complete:function(){
       				$('.modal [data-tombol]').removeAttr('disabled');
       			}
       		});
       		e.preventDefault();
       		
       });

       this.props.dispatch({
       	type:'UPDATE_MODAL_BODY',value:{
       		body:`<div class="row"><form data-tombol="form">
       				<div class="input-group">
       					<label class="input-group-addon">Nama Tipe
		                    <span class="required"> * </span>
		                </label>
		                <input type="text" class="form-control" name="nama_tipe"  />
		                <input type="hidden" name="id_tipe"  />
		                <input type="hidden" name="mode"  />
       				</div>
       			  </form></div><div style="margin-top:15px;" id="pesan-error"></div>`,
       		header:'<h4>Tambah Tipe</h4>',
       		footer:'<button class="btn btn-danger pull-left" data-tombol="simpan">Kirim</button>',
       	}
       });
       this.setDataTable();
    }
    setDataTable(){
    	var {that} = window.helmi ;
    	this.dataTable = $('#tempat-table-crud table').DataTable({
        	 destroy: true,
             processing: true,
             serverSide: true,
             searching: false,
             ajax: {
             	url: window.helmi.api + that.props.page ,
             	data:function(d){
             		d.accesstoken = that.props.accesstoken;
             		d.totalrow = that.totalTabel;
             		d.cari = that.searchQuery;
             	},
             	type: "POST",
             	complete:function(){
             		$('#loading-image').hide();
             	},
             	error:function(xhr){
             		let errorMsg = {error:'Error Load Data',code:503}
             		if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error)errorMsg.error = xhr.responseJSON.error;
             			if(typeof xhr.responseJSON.accesstoken !== 'undefined'){
             				that.props.dispatch({
             					type:'CHANGE_ACCESSTOKEN',value:xhr.responseJSON.accesstoken
             				});
             			}
             		}
             		that.props.dispatch({
             			type:'PAGE_ERROR',value:errorMsg
             		});
             	},
             	dataSrc:(json)=>{
             		if(json.recordsTotal){
             			that.totalTabel = json.recordsTotal;
             		}
             		
             		var baru = [];
             		const {data} = json;
             		for ( var i=0; i < data.length ; i++ ) {
             			var no=0; baru[i]=[];
             			for(var k in data[i] ){
             				baru[i][no] = data[i][k]; 
             				no++;
             			}
             			baru[i][no]='';
             			if(that.props.permission.delete){
             				baru[i][no] +=`<button class="btn btn-action btn-danger" data-id="${data[i].id_tipe}" data-tombol="hapus"><i class="fa fa-times"></i></button>`;
             			}
             			if(that.props.permission.update){
             				baru[i][no] += `<button class="btn btn-action btn-info" data-id="${data[i].id_tipe}" data-tombol="update"><i class="fa fa-gear"></i></button>`;
             			}
				    }
			      return baru;
			    }
             },
             columns:[
             	{name: "id_tipe",searchable: false,  className: "text-center", width: "5%"},
             	{name: "nama_tipe",orderable:false},
             	{name: "action",orderable: false,searchable: false, className: "text-center", width: "15%"}
             ],
             bStateSave:true,
             //pagingType:'bootstrap_extended'
        });
    }
	render(){
		return(
			<div className="col-lg-12">
				<div className="row">
					<div className="col-lg-12">
						<ol className="breadcrumb">
							<li><a >Home</a></li>
							<li className="active"><span>Master Data </span></li>
						</ol>
					<h1>Tipe </h1>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 main-box"> 
						<header className="main-box-header clearfix">
							<h2 className="pull-left">Tipe </h2>
							<div className="filter-block pull-right">
							<a className="btn btn-primary pull-right" data-tombol="tambah">
								<i className="fa fa-plus-circle fa-lg"></i> Tambah Tipe
							</a>
							</div>
						</header>
						<div id="tempat-total-table" className="main-box-body clearfix"></div>
						<div className="main-box-body">
							<div id="tempat-table-crud">
								<table className="table table-striped table-bordered table-hover table-checkable order-column" >
									<thead>
										<tr>
											<th> No </th>
											<th> Nama Tipe Barang </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							<div id="loading-image" style={{textAlign:'center', minHeight:'150px'}}>
								<img src={GambarLoading} alt="Loading...." />
							</div>
							</div>
						</div> 
					</div>
				</div>
			</div>
		);
	}
}
/*===================================================================================================================*/
@connect((store)=>{
	return {
		data : store.dashBoard.pageData,
		page: store.dashBoard.page,
		accesstoken: store.loginInfo.accesstoken,
		permission: store.dashBoard.pagePermission,
	};
})
export class MasterUkuran extends Component{
	tampilModal(){
    	this.props.dispatch({
    		type:'TOGGLE_MODAL',value:true
    	});
    }
    shouldComponentUpdate() {
        return false;
    }
    componentWillUnmount(){
       $('#tempat-table-crud table').DataTable().destroy(true);
       $(document).off('click','[data-tombol]');
       $(document).off('submit','form[data-tombol="form"]');
    }
    constructor(){
    	super();
    	this.totalTabel = 0;
    	this.searchQuery = '';
    	this.dataTable = {};
    	window.helmi.that = this;
    }
    componentDidMount() {
    	$(document).on('click','[data-tombol]',function(e){
       		e.preventDefault();
       		var {that} = window.helmi ;
       		switch($(this).attr('data-tombol')){
       			case 'tambah':
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						if(!that.props.permission.create){
       							$('button[data-tombol="simpan"]').attr('disabled','disabled');
       							$('.modal form input').attr('readonly','readonly');
       						}       						
       					});
       				break;
       			case 'hapus':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('delete');
       						$('.modal form [name="id_ukuran"]').val($(this).attr('data-id'));
       						$('.modal-title h4').text('Delete '+ $(this).attr('data-id') );
       						$('.modal form input').attr('readonly','readonly');
       						$('button[data-tombol="simpan"]').text('DELETE');
       					});
       					
       				}
       				break;
       			case 'update':
       				if(typeof $(this).attr('data-id') !== 'undefined'){
       					that.props.dispatch((dispatch)=>{
       						that.tampilModal();
       						$('.modal form [name="mode"]').val('update');
       						$('.modal form input').attr('readonly','readonly');
       						$.ajax({
       							url: window.helmi.api + that.props.page,
       							data:{id_ukuran:$(this).attr('data-id'),accesstoken:that.props.accesstoken},
       							type:'POST',dataType:'json',
       							success:function(resp){
       							try{
       								if(resp.data){
       									let {data} = resp;
       									$('.modal form input').removeAttr('readonly');
       									for( var k in data[0]){
       										$('.modal form [name="'+k+'"]').val(data[0][k]);
       									}
       								}
       							}catch(e){}
       								
       							}
       						});
       						
       						$('.modal-title h4').text('Update '+ $(this).attr('data-id') );
       						$('button[data-tombol="simpan"]').text('UPDATE').removeClass('btn-danger').addClass('btn-info');
       					});
       					
       				}
       				break;
       			case 'simpan': $('form[data-tombol="form"]').trigger('submit'); break;
       			default:break;
       		}
       });
        $(document).on('submit','form[data-tombol="form"]',function(e){
       		let data ={
       			nama_ukuran:$('.modal form [name="nama_ukuran"]').val() ,
       			id_ukuran:$('.modal form [name="id_ukuran"]').val() ,
       			mode:$('.modal form [name="mode"]').val() ,
       		};
       		var {that} = window.helmi ;
       		data = {...data,accesstoken:that.props.accesstoken};
       		$.ajax({
       			url: window.helmi.api + that.props.page +'/insert_update_delete',
       			data,
       			type:'POST',dataType:'json',
       			success:(resp)=>{
       				if(resp.success && resp.message ){
       					if(resp.total){
       						that.totalTabel += parseInt(resp.total,10) ;
       					}
       					$('.modal #pesan-error').html(`
             				<div class="alert alert-success"><strong>Success : </strong>${resp.message}</div>\
             			`);
             			setTimeout(()=>{
             				that.props.dispatch({type:'TOGGLE_MODAL',value:'false'});
             				that.dataTable.ajax.reload(null, false);
             			},1000);
       				}
       			},
       			error:function(xhr){
       				if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error){
             				$('.modal #pesan-error').html(`
             					<div class="alert alert-danger"><strong>Error : </strong>${xhr.responseJSON.error}</div>
             				`);
             			}
             		}
       			},beforeSend:function(){
       				$('.modal [data-tombol]').attr('disabled','disabled');
       			},complete:function(){
       				$('.modal [data-tombol]').removeAttr('disabled');
       			}
       		});
       		e.preventDefault();
       		
       });

       this.props.dispatch({
       	type:'UPDATE_MODAL_BODY',value:{
       		body:`<div class="row"><form data-tombol="form">
       				<div class="input-group">
       					<label class="input-group-addon">Nama Ukuran
		                    <span class="required"> * </span>
		                </label>
		                <input type="text" class="form-control" name="nama_ukuran"  />
		                <input type="hidden" name="id_ukuran"  />
		                <input type="hidden" name="mode"  />
       				</div>
       			  </form></div><div style="margin-top:15px;" id="pesan-error"></div>`,
       		header:'<h4>Tambah Ukuran</h4>',
       		footer:'<button class="btn btn-danger pull-left" data-tombol="simpan">Kirim</button>',
       	}
       });
       this.setDataTable();
    }
    setDataTable(){
    	var {that} = window.helmi ;
    	this.dataTable = $('#tempat-table-crud table').DataTable({
        	 destroy: true,
             processing: true,
             serverSide: true,
             searching: false,
             ajax: {
             	url: window.helmi.api + that.props.page ,
             	data:function(d){
             		d.accesstoken = that.props.accesstoken;
             		d.totalrow = that.totalTabel;
             		d.cari = that.searchQuery;
             	},
             	type: "POST",
             	complete:function(){
             		$('#loading-image').hide();
             	},
             	error:function(xhr){
             		let errorMsg = {error:'Error Load Data',code:503}
             		if(typeof xhr.responseJSON !== 'undefined'){
             			if(xhr.responseJSON.error)errorMsg.error = xhr.responseJSON.error;
             			if(typeof xhr.responseJSON.accesstoken !== 'undefined'){
             				that.props.dispatch({
             					type:'CHANGE_ACCESSTOKEN',value:xhr.responseJSON.accesstoken
             				});
             			}
             		}
             		that.props.dispatch({
             			type:'PAGE_ERROR',value:errorMsg
             		});
             	},
             	dataSrc:(json)=>{
             		if(json.recordsTotal){
             			that.totalTabel = json.recordsTotal;
             		}
             		
             		var baru = [];
             		const {data} = json;
             		for ( var i=0; i < data.length ; i++ ) {
             			var no=0; baru[i]=[];
             			for(var k in data[i] ){
             				baru[i][no] = data[i][k]; 
             				no++;
             			}
             			baru[i][no]='';
             			if(that.props.permission.delete){
             				baru[i][no] +=`<button class="btn btn-action btn-danger" data-id="${data[i].id_ukuran}" data-tombol="hapus"><i class="fa fa-times"></i></button>`;
             			}
             			if(that.props.permission.update){
             				baru[i][no] += `<button class="btn btn-action btn-info" data-id="${data[i].id_ukuran}" data-tombol="update"><i class="fa fa-gear"></i></button>`;
             			}
				    }
			      return baru;
			    }
             },
             columns:[
             	{name: "id_ukuran",searchable: false,  className: "text-center", width: "5%"},
             	{name: "nama_ukuran",orderable:false},
             	{name: "action",orderable: false,searchable: false, className: "text-center", width: "15%"}
             ],
             bStateSave:true,
             //pagingType:'bootstrap_extended'
        });
    }
	render(){
		return(
			<div className="col-lg-12">
				<div className="row">
					<div className="col-lg-12">
						<ol className="breadcrumb">
							<li><a >Home</a></li>
							<li className="active"><span>Master Data </span></li>
						</ol>
					<h1>Ukuran </h1>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 main-box"> 
						<header className="main-box-header clearfix">
							<h2 className="pull-left">Ukuran </h2>
							<div className="filter-block pull-right">
							<a className="btn btn-primary pull-right" data-tombol="tambah">
								<i className="fa fa-plus-circle fa-lg"></i> Tambah Ukuran
							</a>
							</div>
						</header>
						<div id="tempat-total-table" className="main-box-body clearfix"></div>
						<div className="main-box-body">
							<div id="tempat-table-crud">
								<table className="table table-striped table-bordered table-hover table-checkable order-column" >
									<thead>
										<tr>
											<th> No </th>
											<th> Nama Ukuran Barang </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							<div id="loading-image" style={{textAlign:'center', minHeight:'150px'}}>
								<img src={GambarLoading} alt="Loading...." />
							</div>
							</div>
						</div> 
					</div>
				</div>
			</div>
		);
	}
}
/*===================================================================================================================*/
@connect((store)=>{
	return {
		userInfo : store.dashBoard.user ,
		page : store.dashBoard.page
	};
})
export class MasterSupplier extends Component{	
	render(){ 
		return(
			<div id="theme-wrapper"> 
			</div>
		);
	}
}
/*===================================================================================================================*/
@connect((store)=>{
	return {
		userInfo : store.dashBoard.user ,
		page : store.dashBoard.page
	};
})
export class MasterBarangJasa extends Component{	
	render(){ 
		return(
			<div id="theme-wrapper"> 
			</div>
		);
	}
}