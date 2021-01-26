import React, { Component } from 'react';
import { Label, Card, CardText, CardImg, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Col, Modal, ModalBody, ModalHeader, Button, } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Errors, LocalForm, Control } from 'react-redux-form'
import Row from 'reactstrap/lib/Row';
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => {
    return (!val) || (val.length <= len);
};
const minLength = (len) => (val) => (val) && (val.length >= len);

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.RenderDish = this.RenderDish.bind(this);
        this.RenderComments = this.RenderComments.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            isModalOpen: false
        };
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        console.log("Current State is " + JSON.stringify(values));
        alert("Current State is " + JSON.stringify(values));
        this.props.postComment(this.props.dish.id, values.rating, values.name, values.message);
        this.toggleModal();
    }
    RenderDish() {
        return (
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + this.props.dish.image} alt={this.props.dish.description} />
                    <CardBody>
                        <CardTitle className="font-weight-bold">{this.props.dish.name}</CardTitle>
                        <CardText>{this.props.dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    }
    RenderComments() {
        if (this.props.comments != null) {
            const fn = this.props.comments.map((it) => {
                return (
                    <Fade in>
                        <li key={it.id}>
                            <div>
                                <p className="font-weight-bold">{it.comment}</p>
                                <p>--{it.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(it.date)))}</p>
                            </div>
                        </li>
                    </Fade>
                );
            });
            return (
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                            {fn}
                        </Stagger>
                    </ul>
                    <Button outline onClick={this.toggleModal}>
                        <span className="fa fa-pencil fa-lg" /> Submit Comment
                    </Button>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
    render() {
        if (this.props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (this.props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <h4>{this.props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (this.props.dish != null) {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <div className="col-12">
                                <h3>{this.props.dish.name}</h3>
                                <hr />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-5 m-1">
                                <this.RenderDish />
                            </div>
                            <this.RenderComments />
                        </div>
                    </div>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>
                            Submit Comment
                        </ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Col>
                                        <Label htmlFor="rating">Rating</Label>
                                        <Control.select className="form-control" model=".rating" name="rating">
                                            <option selected>1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col>
                                        <Label htmlFor="name">Your Name</Label>
                                        <Control.text className="form-control" id="name" name="name"
                                            model=".name" placeholder="Your Name"
                                            validators={{
                                                maxLength: maxLength(15),
                                                minLength: minLength(3)
                                            }} />
                                        <Errors
                                            className="text-danger"
                                            show="touched"
                                            model=".name"
                                            messages={{
                                                minLength: "Must be Greater than 2 Characters",
                                                maxLength: "Must be less than 15 Characters"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col>
                                        <Label htmlFor="message">Comment</Label>
                                        <Control.textarea className="form-control" id="message" name="message"
                                            model=".message" rows="6" />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col>
                                        <Button type="submit" color="primary">Submit</Button>
                                    </Col>
                                </Row>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </React.Fragment>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
}
export default DishDetail;