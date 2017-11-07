import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import LOADING from '../Imgs/loading.gif';
import LS from '../Action/LocalStorage';
import {connect} from 'react-redux';

@connect((store)=>{
	return {userInfo : store.dashBoard };
})

export default class DashboardHeaderNavBar extends Component {
	constructor(){
		super();
		this.state={
			notif:false
			,loadNotif:false,loadingNotif:false
		};
		this.handleNotif={};
		this.handleNotif.loading=false;
		this.handleNotif.onblur = ()=>{
			if(this.state.notif){
				this.setState({notif:!this.state.notif });
			}
		}
		this.handleNotif.onclick = ()=>{
			if(!this.state.loadingNotif){
				this.setState({
					loadingNotif:true
				});
				LS.sendAjax({
					url:window.helmi.api + 'notif',
					type:'POST',
					data:Object.assign({},LS.ajaxOpt.data ,{} ),
					success:function(data){
						if(data.notif){
							this.setState({loadNotif:data.notif});
						}						
					}.bind(this)
				});
			}
			this.setState({
				notif:!this.state.notif
			});
		}
		this.clickLogout=()=>{
			this.props.dispatch({type:'CHANGE_ACCESSTOKEN',value:false});
		}
	}
	render(){
		
		let LIST2 = [
			{name:'George Clooney',pic:'/external/img/samples/messages-photo-1.png',teks:"Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw...",waktu:'13 min.'}
			,{name:'Emma Watson',pic:'/external/img/samples/messages-photo-2.png',teks:"Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw...",waktu:'13 min.'}
			,{name:'Robert Downey Jr.',pic:'/external/img/samples/messages-photo-3.png',teks:"Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw...",waktu:'13 min.'}
		];
		const cntList2 = LIST2.length ;
		LIST2 = LIST2.map((val)=>{
			return <DashboardHeaderNavBarListMessage obj={val} />
		});
		let LIST3 = [
			{link:'',teks:'Profile',iconKlass:'fa-user'}
			,{link:'',teks:'Settings',iconKlass:'fa-cog'}
			,{link:'',teks:'Messages',iconKlass:'fa-envelope-o'}
			,{link:'',teks:'Logout',iconKlass:'fa-power-off'}
		
		].map((val)=>{
			return <DashboardHeaderNavBarListDD obj={val} />
		});

		let userDetail = {...this.props.userInfo.user};
		userDetail.name = userDetail.name.substr(0,18);

		return(
			<div className="nav-no-collapse pull-right" id="header-nav">
			<ul className="nav navbar-nav pull-right">
			<li className="mobile-search"> <a className="btn"> <i className="fa fa-search"></i> </a>
				<div className="drowdown-search">
				<form role="search">
					<div className="form-group">
					<input type="text" className="form-control" placeholder="Search..." />
					<i className="fa fa-search nav-search-icon"></i>
					</div>
				</form>
				</div>
			</li>
			<li onBlur={this.handleNotif.onblur} tabIndex="0" className={ 'dropdown hidden-xs ' + (this.state.notif ? 'open' : '' )} >
				<a href="#" onClick={this.handleNotif.onclick} className="btn dropdown-toggle" data-toggle="dropdown"> <i className="fa fa-warning"></i> <span className="count">8</span> </a>
				{ this.state.loadNotif ? <ULnotifMessage obj={this.state.loadNotif} />:  <LoadingUl className="notifications-list" css={{margin:'10% auto'}} /> }
			</li>
			<Dropdown componentClass="li" className="hidden-xs">
  				<Dropdown.Toggle useAnchor={true} noCaret>
					<i className="fa fa-envelope-o"></i> <span className="count">{cntList2}</span>
				</Dropdown.Toggle>
				<Dropdown.Menu className="notifications-list messages-list">
				    <li className="pointer"> <div className="pointer-inner"> <div className="arrow"></div> </div> </li>
				  	{LIST2}
					<li className="item-footer"> <a href="#"> View all messages </a> </li>
				</Dropdown.Menu>
			</Dropdown>

			<li className="hidden-xs"> <a className="btn"> <i className="fa fa-cog"></i> </a> </li>
			<Dropdown componentClass="li" className="profile-dropdown">
  				<Dropdown.Toggle useAnchor={true} noCaret>
					<img src={userDetail.photo} alt=""/>
					<span className="hidden-xs">{userDetail.name}</span> <b className="caret"></b>
				</Dropdown.Toggle>
				<Dropdown.Menu >
				    {LIST3}
				</Dropdown.Menu>
			</Dropdown>

			<li className="hidden-xxs"> <a className="btn" onClick={this.clickLogout} > <i className="fa fa-power-off"></i> </a> </li>
			</ul>
			</div>
		);
	}
}

class DashboardHeaderNavBarListNotif extends Component{
	render(){
		return(
			<li className="item">
				<a ><i className={'fa '+ this.props.obj.iconKlass }></i>
				<span className="content">{this.props.obj.teks}</span>
				<span className="time"><i className="fa fa-clock-o"></i>{this.props.obj.waktu}</span>
				</a>
			</li>
		);
	}
}
class DashboardHeaderNavBarListMessage extends Component{
	render(){
		return(
			<li className="item first-item">
				<a >
				<img src={this.props.obj.pic} alt={'Photos Profile of ' +this.props.obj.name} />
				<span className="content">
				<span className="content-headline">{this.props.obj.name}</span>
				<span className="content-text">{this.props.obj.teks}</span>
				</span> 
				<span className="time"><i className="fa fa-clock-o"></i>{this.props.obj.waktu}</span>
				</a>
			</li>
		);
	}
}
class DashboardHeaderNavBarListDD extends Component{
	render(){
		return(
			<li><a href={this.props.obj.link}><i className={'fa '+ this.props.obj.iconKlass }></i>{this.props.obj.teks}</a></li>
		);
	}
}
class ULnotifMessage extends Component{
	render(){
		/*let LIST = [
			{iconKlass:'fa-comment',teks:'New comment on ‘Awesome P...',waktu:'13 min.'}
			,{iconKlass:'fa-plus',teks:'New user registration',waktu:'13 min.'}
			,{iconKlass:'fa-envelope',teks:'New Message from George',waktu:'13 min.'}
			,{iconKlass:'fa-shopping-cart',teks:'New purchase',waktu:'13 min.'}
			,{iconKlass:'fa-eye',teks:'New order',waktu:'13 min.'}
		];*/
		let LIST = typeof this.props.obj !== 'undefined' ? this.props.obj : [] ;
		const cntList = LIST.length ;
		LIST = LIST.map((val)=>{
			return <DashboardHeaderNavBarListNotif obj={val} />
		});

		return(
			<ul className="dropdown-menu notifications-list">
				<li className="pointer">
					<div className="pointer-inner"> <div className="arrow"></div> </div>
				</li>
				<li className="item-header"> { cntList > 0 ? 'You have '+cntList+' new notifications' : 'Notif Message Not Found' } </li>
				{LIST}
				<li className="item-footer"> <a href="#"> View all notifications </a> </li>
			</ul>
		);
	}
}
class LoadingUl extends Component{
	render(){
		let classNya = typeof this.props.className !== 'undefined' ? this.props.className : '';
		return(
			<ul className={'dropdown-menu '+ classNya } >
				<li className="pointer">
					<div className="pointer-inner"> <div className="arrow"></div> </div>
				</li>
				<div className="text-center" style={this.props.css} ><img src={LOADING} alt="Loading" /></div>
			</ul>
		);
	}
}


