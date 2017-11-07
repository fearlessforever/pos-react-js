import React,{Component} from 'react';
import { connect } from 'react-redux';
import LS from '../Action/LocalStorage';

@connect((store) =>{
	return {
		list:store.dashBoard.table,
		isLoading:store.dashBoard.pageIsLoading,
		page:store.dashBoard.page,
		accesstoken:store.loginInfo.accesstoken,
	};
})

export class DashboardSidebar extends Component{
	
	loadAjaxPage(page){
		if( !this.props.isLoading ){
		this.props.dispatch((dispatch) =>{
			dispatch({type:'PAGE_LOADING' });
			LS.sendAjax({
				url:window.helmi.api + page +'/permit',
				data:{...LS.ajaxOpt.data , accesstoken:this.props.accesstoken},
				success:function(response){
					if(response.accesstoken){
						dispatch({type:'CHANGE_ACCESSTOKEN',value:response.accesstoken });
					}
					if(response.success){
						dispatch({type:'UPDATE_PAGE',value:page });
					}
					if(response.permission){
						dispatch({type:'UPDATE_PAGE_PERMISSION',value:response.permission });
					}
				},
				error:function(xhr){
					let errorMsg = {error:'Error Load Page',code:''};
					if(typeof xhr.responseJSON !== 'undefined'){
						if(xhr.responseJSON.error)errorMsg.error = xhr.responseJSON.error;
						if(typeof xhr.responseJSON.accesstoken !== 'undefined'){
							setTimeout(() =>{
								dispatch({ type:'CHANGE_ACCESSTOKEN',value:xhr.responseJSON.accesstoken });
							},7000);
	             		}
					}
					dispatch({type:'PAGE_ERROR',value:errorMsg});
				}
			});
		});
		}
		
	}
	componentWillMount() {
		this.loadAjaxPage(this.props.page);
	}
	render(){
		let collapseMiniView = typeof this.props.obj !== 'undefined' ? this.props.obj : false;
		//let list= [...this.props.list] ;
		const {list,obj,user} = this.props;
		// {...props} 
		const LIST = list.map((val) =>{
			return <DashboardSidebarLi obj={val} func={this.loadAjaxPage.bind(this)}/>
		});
		let userDetail = {...user};
		userDetail.name = userDetail.name.substr(0,8); 
		return(
			<div id="nav-col">
			<section id="col-left" className="col-left-nano">
			<div id="col-left-inner" className="col-left-nano-content">
				<div id="user-left-box" className="clearfix hidden-sm hidden-xs">
					<img alt="" src={userDetail.photo} />
					<div className="user-box">
						<span className="name"> Welcome<br/> {userDetail.name} </span>
						<span className="status"> <i className="fa fa-circle"></i> Online </span>
					</div>
				</div>
			<div className={'collapse navbar-collapse navbar-ex1-collapse' + (collapseMiniView ? ' in' : '') } id="sidebar-nav">
			<ul className="nav nav-pills nav-stacked"> {LIST} </ul>
			</div>
			</div>
			</section>
			</div>
		);
	}
}

class DashboardSidebarLi extends Component{
	constructor(){
		super();
		this.state={
			tampilSubmenu:{}
		};
	}
	handleClick(e){
		e.preventDefault();
		this.setState({
			tampilSubmenu:( this.state.tampilSubmenu.display ? {} : {display:'block'} )
		});
	}

	handleClickPage(e){
		let target = e.target  ;
		let page = this.props.page ;
		if(target.getAttribute('href')){
			page = target.getAttribute('href')
		}
		if(typeof this.props.func === 'function'){
			this.props.func(page);
		}
		e.preventDefault();
	}
	
	render(){
		const {obj,...props} = this.props;
		const LIST = obj.submenu ? obj.submenu.map((val) =>{
			return <DashboardSidebarLi obj={val} {...props} />
		}) :'';
		let KELAS ='',kelasDropdown='';
		if(LIST){
			KELAS += ' dropdown-toggle';
		}
		if(this.state.tampilSubmenu.display){
			kelasDropdown += 'open';
		}
		return(
			<li className={kelasDropdown}>
				<a href={LIST ? '#' : this.props.obj.link} className={KELAS} onClick={LIST ? this.handleClick.bind(this) : this.handleClickPage.bind(this) }>
					<i className={'fa '+ (this.props.obj.iconKlass ? this.props.obj.iconKlass : '' )}></i>
					<span>{this.props.obj.name}</span> 
					{LIST ? <i className="fa fa-chevron-circle-right drop-icon"></i> : '' }
					{this.props.obj.itung ? <span className="label label-info label-circle pull-right">{this.props.obj.itung}</span> : '' }
					{this.props.obj.pesan ? <span className={'label '+this.props.obj.pesan.klass+' pull-right'} > {this.props.obj.pesan.teks} </span> : ''}
				</a>
				{ LIST ? <ul className="submenu" style={this.state.tampilSubmenu} >{LIST}</ul> : '' }
			</li>
		);
	}
}