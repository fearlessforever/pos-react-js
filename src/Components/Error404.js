import React, { Component } from 'react';
import LogoError from '../Imgs/error-404-v3.png';

class Error404 extends Component {
	constructor(){
		super();
		this.state={
		};
	}
	
  	render(){
		document.body.className = '';
		document.body.className = 'error-page';
		let error = {code:'404' , error : '' };
		if(typeof this.props.obj !== 'undefined'){
			error = {...error, code:this.props.obj.code,error:this.props.obj.error};
		}
		return(
			<div class="container">
				<div class="row">
					<div class="col-xs-12">
						<div id="error-box">
							<div class="row">
							<div class="col-xs-12">
								<div id="error-box-inner"> <img src={LogoError} alt="Have you seen this page?"/> </div>
								<h1> ERROR { error.code }</h1>
								<p> {error.error ? error.error : <div dangerouslySetInnerHTML={
									{__html: 'Page not found. <br/>If you find this page, let us know.' }

									} />} </p>
								<p> Go back to <a href="/">Homepage</a>. </p>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Error404;
