import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getUserToken } from "../redux/actions/user_action";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

class Login extends Component {
  state = {
    email: "",
    password: "",
    userMsg: ""
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("http://localhost:8012/login", user)
      .then(response => {
        this.props.availableToken(response.data.token);
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({ userMsg: error.response.data.message });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { email, password, userMsg } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit} style={styles.form}>
          {userMsg}
          <label>Votre email : </label>
          <input
            onChange={this.handleChange}
            value={email}
            type="text"
            name="email"
            placeholder="enter your email"
            required
          />
          <label>Votre mot de passe : </label>
          <input
            onChange={this.handleChange}
            value={password}
            name="password"
            type="password"
            placeholder="enter your password"
            required
          />
          <button onSubmit={this.handleSubmit}>Connexion</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("state login.js", state);
  return {
    token: state.user.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    availableToken(token) {
      dispatch(getUserToken(token));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
