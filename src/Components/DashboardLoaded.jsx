import React,{Component} from 'react';
import {connect} from 'react-redux';
import DashboardHeader from './DashboardHeader';
import DashboardConfig from './DashboardConfig';
import DashboardFooter from './DashboardFooter';
import {DashboardSidebar} from './DashboardSidebar';

import {Modal, Button , OverlayTrigger , Popover , Tooltip } from 'react-bootstrap';

import LogoError from '../Imgs/error-404-v3.png';
import {
	MasterSatuan,MasterTipe,MasterUkuran,MasterSupplier,MasterBarangJasa
} from './Page/Master'; 

@connect((store) =>{
	return {
		userInfo : store.dashBoard.user ,
		page : store.dashBoard.page
	};
})


export class DashboardLoaded extends Component{
	constructor(){
		super();
		this.state={
			navSmall:false,miniViewCollapse:false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleClick2 = this.handleClick2.bind(this);
	}
	handleClick(){
		this.setState({navSmall:!this.state.navSmall});
	}
	handleClick2(){
		this.setState({miniViewCollapse:!this.state.miniViewCollapse});
	}
	componentWillMount() {
		try{
			if(this.props.match.params.oke)
			this.props.dispatch({
				type:'UPDATE_PAGE',
				value:this.props.match.params.oke
			});
		}catch(e){}
	}
	render(){
		let user = this.props.userInfo ;
		let element ='';
		let history = window.history || {};
		if(typeof history.replaceState === 'function'){
			history.replaceState({ fromDashboard: true },'', this.props.page );
		}
		let page = this.props.page ;
		switch( page.replace(/\.html/i,'') ){
			case 'master-barang-jasa': element = <MasterBarangJasa />; break;
			case 'master-supplier': element = <MasterSupplier />; break;
			case 'master-ukuran': element = <MasterUkuran />; break;
			case 'master-tipe': element = <MasterTipe />; break;
			case 'master-satuan': element = <MasterSatuan />; break;
			case '': element = <DashboardLoading /> ; break;
			default: element = <ErrorLoadPage /> ; break;
		}
		return(
			<div id="theme-wrapper">
				<DashboardHeader func={this.handleClick} func2={this.handleClick2} />
				<DashboardConfig />
				<div id="page-wrapper" className={'container' + (this.state.navSmall ? ' nav-small ' : '') }>
					<div className="row">
						<DashboardSidebar user={user} obj={this.state.miniViewCollapse} />
						<div id="content-wrapper">
							{element}
						</div>
						<ModalPage />
						<DashboardFooter />
					</div>
				</div>
			</div>
		);
	}
}

export class DashboardLoading extends Component {
	render() {
	const css ={
		margin: 15 +'% auto'
	};

    return (
    	<div className="text-center" style={css}>
    		<h1>Loading ...... </h1>
    	</div>
    	
    );
  }
}

@connect((store) =>{
	return {
		open: store.dashBoard.modalOpen,
		contentBody:store.dashBoard.modalContent,
		modalSize:store.dashBoard.modalSize,
	};
})
class ModalPage extends Component {
	closeModal(){
		this.props.dispatch({
			type:'TOGGLE_MODAL',value:'false'
		});
	}
	render(){
		const popover = (
	      <Popover id="modal-popover" title="popover">
	        very popover. such engagement
	      </Popover>
	    );
	    const tooltip = (
	      <Tooltip id="modal-tooltip">
	        wow.
	      </Tooltip>
	    );
	    let modal ={body:'',header:'Modal heading',footer:''};
	    modal.body = (
	    	<div>
	    			<h4>Text in a modal</h4>
		            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

		            <h4>Popover in a modal</h4>
		            <p>there is a <OverlayTrigger overlay={popover}><a href="#">popover</a></OverlayTrigger> here</p>

		            <h4>Tooltips in a modal</h4>
		            <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>

		            <hr />

		            <h4>Overflowing text to show scroll behavior</h4>
		            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
		            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
		            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
		            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
		            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
		            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
		            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
		            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
		            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
	    	</div>
	    );
	    let {contentBody} = this.props ; 
	    if( contentBody.body){
	    	modal.body = <div dangerouslySetInnerHTML={{__html:contentBody.body}} />;
	    }
	    if(contentBody.footer){
	    	modal.footer = <div dangerouslySetInnerHTML={{__html:contentBody.footer}} />;
	    }
	    if(contentBody.header){
	    	modal.header = <div dangerouslySetInnerHTML={{__html:contentBody.header}} />;
	    }

		return(
			<div class="container">
				<Modal bsSize={this.props.modalSize} show={this.props.open} onHide={this.closeModal.bind(this)}>
		          <Modal.Header closeButton>
		            <Modal.Title> {modal.header} </Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		            {modal.body}
		          </Modal.Body>
		          <Modal.Footer>
		          	{modal.footer}
		            <Button onClick={this.closeModal.bind(this)}>Close</Button>
		          </Modal.Footer>
		        </Modal>
			</div>
		);
	}
}

@connect((store) =>{
	return {
		errorMsg : store.dashBoard.errorData
	};
})
class ErrorLoadPage extends Component {
	render(){
		/*document.body.className = '';
		document.body.className = 'error-page';*/
		let error = {code:'404' , error : '' };
		if(typeof this.props.errorMsg !== 'undefined'){
			error = {...error, code:this.props.errorMsg.code,error:this.props.errorMsg.error};
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