import React, { Component } from 'react';
import { Redirect } from 'react-router';
import LS from '../Action/LocalStorage';
import LogoError from '../Imgs/error-500-v1.png';

//Halaman Dashboard
import { DashboardLoaded ,DashboardLoading as Loading} from './DashboardLoaded';
import {connect} from 'react-redux';
@connect((store)=>{
	return{
		accesstoken:store.loginInfo.accesstoken
	};
})

class Dashboard extends Component {
	constructor(){
		super();
		this.state={
			loaded:false,errorLoad:false,data:false
		};
	}
	setAccessToken(){
		window.helmi.accesstoken = LS.get('accesstoken');
		LS.ajaxOpt.data = Object.assign({},LS.ajaxOpt.data,{accesstoken: LS.get('accesstoken') });
	}
	checkAccesstokenExist(){
		if(!this.props.accesstoken){
			return <Redirect push to="/" />
		}			
	}

	changeBackground(){
		document.body.className = '';
		document.body.className = LS.get('body-tema');
	}
	componentWillMount(){
		this.setAccessToken();
		this.changeBackground();
		LS.sendAjax({
			success:function(data){
				if(data.success){
				this.props.dispatch({
					type:'UPDATE_DASHBOARDINFO',
					value:data
				});

				}else{
					this.setState({errorLoad:true});
				}
			}.bind(this),
			error:function(xhr,stat,err){
				const {responseJSON,status} = xhr ;
				let error = responseJSON ? responseJSON : {};
				error.code = status ? status : false;
				this.setState({errorLoad:error});
				setTimeout(()=>{
					this.props.dispatch({
             			type:'CHANGE_ACCESSTOKEN',value:false
             		});
				},7000);
			}.bind(this),
			complete:function(){
				this.setState({loaded:true});
			}.bind(this)
		});
	}
  render() {
  	let {...props} = this.props;
    return (
    	<div>
    		{this.state.loaded ?  (
    			this.state.errorLoad ? <DashboardError obj={this.state.errorLoad} /> : <DashboardLoaded {...props} /> 
    			)  
    		: <Loading /> }
    		    		
    		{this.checkAccesstokenExist()}
    	</div>
    	
    );
  }
}
// <h1>Tes {this.props.match.params.oke} </h1>
export default Dashboard;

class DashboardError extends Component{

	render(){
		document.body.className = '';
		document.body.className = 'error-page';
		LS.remove('accesstoken');

		let error = {code:'500' , error : '' };
		if(typeof this.props.obj !== 'undefined'){
			let {obj} = this.props ;
			if(obj.code) error.code = obj.code;
			if(obj.error) error.error = obj.error;
		}

		return(
			<div class="container">
				<div class="row">
					<div class="col-xs-12">
						<div id="error-box">
							<div class="row">
							<div class="col-xs-12">
								<div id="error-box-inner"> <img src={LogoError} alt="Error "/> </div>
								<h1> ERROR { error.code } </h1>
								<p> { error.error ? error.error : 'Something went very wrong. We are sorry for that.'} </p>
								<p> Go back to <a href="/">homepage</a>. </p>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}