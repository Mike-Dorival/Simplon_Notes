import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../../shared/Modal/Modal";

class CreateArticle extends Component {
  state = {
    title: "",
    subTitle: "",
    body: "",
    success: "",
    file: [],
    messageError: "",
    show: false,
    msgUserDisconnect: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, body } = this.state;
    const formData = new FormData();

    const imageArr = Array.from(this.state.file);
    imageArr.forEach(image => {
      formData.append("myImage", image);
    });

    const article = {
      user_id: this.props.userId,
      author: this.props.name,
      title: this.state.title,
      subtitle: this.state.subTitle,
      body: this.state.body
    };

    formData.append("myArticle", JSON.stringify(article));

    if (title && body) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/articles`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            "x-auth-token": this.props.token
          }
        })
        .then(response => {
          this.setState({ show: true, success: response.data.message });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/article");
          }, 1300);
        })
        .catch(error => {
          const userDeconnect = error.response.status === 401;
          const fileExtension = error.response.status === 404;
          const numberImagesExceeded = error.response.status === 500;
          if (numberImagesExceeded) {
            this.setState({ messageError: error.response.data.message });
          }
          if (fileExtension) {
            this.setState({ messageError: error.response.data.message });
          }
          if (userDeconnect) {
            this.setState({ msgUserDisconnect: error.response.data.message, show: true })
          }
        });
    }
  };

  onChange = event => {
    this.setState({ file: event.target.files });
  };

  msgUserDisconnect = () => {
    this.props.removeToken(this.props.token);
    this.props.history.push("/");
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { show, msgUserDisconnect } = this.state
    return (
      <div>
        <div className="CreateArticle__container">
          <Modal show={this.state.show}>{this.state.success}</Modal>
          {
            show && !!msgUserDisconnect ? (
            <div className="Modal__container">
              <div className="Modal__main">
                <h4>{msgUserDisconnect}</h4>
                <button
                    className="btn btn-primary"
                    onClick={() => this.msgUserDisconnect()}
                  >
                    OK
                  </button>
              </div>
            </div>
            ) : null
          }
          <form
            className="CreateArticle__container__form mt-5"
            onSubmit={this.handleSubmit}
          >
            <p>{this.state.messageError}</p>
            <label>Titre</label>
            <input
              onChange={this.handleChange}
              name="title"
              type="text"
              placeholder="Title"
              className="CreateArticle__container__input"
              required
            />
            <label>Sous-titre</label>
            <input
              onChange={this.handleChange}
              name="subTitle"
              type="text"
              placeholder="subTitle"
              className="CreateArticle__container__input"
              required
            />
            <label>Image</label>
            <input
              name="myImage"
              type="file"
              multiple
              onChange={this.onChange}
              className="CreateArticle__container__input"
            />
            <label>Corps</label>
            <textarea
              className="textarea"
              placeholder="Votre article"
              name="body"
              rows="5"
              cols="33"
              type="text"
              required
              onChange={this.handleChange}
            />
            <button className="btn btn-success mt-2" type="submit">
              Valider mon article
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.userId,
    token: state.token,
    name: state.userName
  };
}

export default connect(mapStateToProps)(CreateArticle);
