import React, { Component } from 'react';
import logo from '../Imgs/logo.png';
import $ from 'jquery';
import '../Css/login.css';
import MsgAlert from './MessageAlert';
import Loading from './GambarLoading';
import {Redirect} from 'react-router';

import {connect} from 'react-redux';
@connect((store)=>{
	return{
		accesstoken:store.loginInfo.accesstoken
	};
})

class Login extends Component {
	constructor(){
		super(); 
		this.state={
			pesan_error:'',
			checked_system:false,
			nama_system:'',
			loading:false,
			error_msg:{
				teks:false,
				tipe:false,
				kelas:false
			}
		};
		this.handleClickAlert=this.handleClickAlert.bind(this);
	}
	handleClickAlert(){
		this.setState({
			error_msg:{
			teks:false,
			tipe:false,
			kelas:false
			}
		});
	}
	checkAccesstokenExist(){
		if(this.props.accesstoken)
			return <Redirect push to="/dashboard/index"/>
	}
	toggleDisabled(){
		return this.state.checked_system ? '' : 'disabled';
	}
	changeBackground(){
		document.body.className = 'login';
	}
	componentWillMount(){
		if(!this.props.accesstoken)this.handleCheckSystem();
		this.changeBackground();
	}
	handleCheckSystem(){
		$.ajax({
			url: window.helmi.api + 'system'
			,data:{system:window.helmi.system}
			,type:'POST'
			,dataType:'json'
			,success:function(data){
				if(data.success){
					this.setState({checked_system:true});
				}
				if(data.system_name){
					this.setState({nama_system:data.system_name});
				}
			}.bind(this)
			,error:function(xhr){
				let error = 'Connection Problem';
				if(typeof xhr.responseJSON !== 'undefined'){
					error = xhr.responseJSON.error ? xhr.responseJSON.error : error ;
				}
				this.setState({
					error_msg:{ teks:error }
				});
			}.bind(this)
		});
	}
	handleSubmit(e){
		e.preventDefault();
		if(this.refs.username.value === '' || this.refs.password.value === ''){
			this.setState({
				error_msg:{ teks:'Empty Username (email) or Password ' }
			});
			return;
		}

		$.ajax({
			url: window.helmi.api + 'login'
			,data:{email:this.refs.username.value,password:this.refs.password.value,system:window.helmi.system}
			,type:'GET'
			,dataType:'json'
			,beforeSend:function(){
				//this.setState({error_msg:{teks:'...',kelas:'alert alert-warning',tipe:'Please wait '}});
				this.setState({error_msg:{teks:''}});
				this.setState({loading:true});
			}.bind(this)
			,success:function(data){
				if(data.accesstoken){
					this.props.dispatch({
						type:'CHANGE_ACCESSTOKEN',
						value:data.accesstoken
					});
					this.setState({
						checked_system:false,
						accesstoken: data.accesstoken,
						error_msg:{
							teks:'You have Logged In',
							tipe:'Success',
							kelas:'alert alert-success'
						}
					});
				}
			}.bind(this)
			,error:function(xhr){
				let error = 'Connection Problem';
				if(typeof xhr.responseJSON !== 'undefined'){
					error = xhr.responseJSON.error ? xhr.responseJSON.error : error ;
				}
				this.setState({
					error_msg:{teks:error,kelas:false,tipe:'Error'}
				});
			}.bind(this),
			complete:function(){
				this.setState({loading:false});
			}.bind(this)
		});
	}
	handleKeyPress(e){
		if(e.which === 13){
			this.handleSubmit(e);
		}
	}

  render() {
    return (
      	<div id="login-full-wrapperz">
			<div className="container">
				<div className="row">
					<div className="col-md-12 col-xs-12">
						<div id="login-box" className="tambahan">
							<div id="login-box-holder" >
								<div className="row">
								<div className="col-xs-12">
				<header id="login-header">
					<div id="login-logo">
						<img alt="" src={logo} />
					</div>
				</header>
								<div id="login-box-inner">
				<form onSubmit={this.handleSubmit.bind(this)}>
					<div className="input-group">
						<span className="input-group-addon"><i className="fa fa-user"></i></span>
						<input onKeyPress={this.handleKeyPress.bind(this)} id="loginmail" disabled={this.toggleDisabled()} name="username" ref="username" type="text" placeholder="Type Your Username Or Email Here" className="form-control" />
					</div>
					<div className="input-group">
						<span className="input-group-addon"><i className="fa fa-key"></i></span>
						<input onKeyPress={this.handleKeyPress.bind(this)} id="loginpass" disabled={this.toggleDisabled()} name="password" ref="password" type="password" placeholder="Type Your Password" className="form-control" />
					</div>
					<div id="remember-me-wrapper">
						<div className="row">
							<div className="col-xs-6">
								<div className="checkbox-nice">
									<input type="checkbox" id="remember-me" name="remember" /> <label for="remember-me"> Remember Me </label>
								</div>
							</div>
						</div>
					</div>
				</form>
								
				<div className="row">
					<div className="col-xs-12">
						<button disabled={this.toggleDisabled()} onClick={this.handleSubmit.bind(this)} className="btn btn-success col-xs-12" type="submit"> Login </button>
					</div>
				</div> 
				<div className="row">
					<div className="col-xs-12">
						<p className="social-text">
							<MsgAlert pesan={this.state.error_msg} onClick={this.handleClickAlert} />
							<Loading show={this.state.loading} />
						</p>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 col-sm-6">
						<a className="btn btn-primary col-xs-12 btn-facebook" rel="noopener noreferrer" target="_blank" href="http://www.facebook.com/fearlessforever"><i className="fa fa-facebook"></i> Facebook</a>
					</div>
					<div className="col-xs-12 col-sm-6">
						<a className="btn btn-primary col-xs-12 btn-twitter" rel="noopener noreferrer" target="_blank" href="http://www.facebook.com/fearlessforever"> <i className="fa fa-twitter"></i> Twitter </a>
					</div> 
				</div>
				<div className="row">
					<div className="col-xs-12">
						<a href="/tes"><i > {this.state.nama_system} </i></a> {this.checkAccesstokenExist()}
					</div> 
				</div>
								
								</div>
								</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
    );
  }
}

export default Login;
