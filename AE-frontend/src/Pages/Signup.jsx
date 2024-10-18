import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        role: '',
        sex: '',
        profilePhoto: null,
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setUserData({ ...userData, profilePhoto: e.target.files[0] });
    };

    const handleUserSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});

        const formData = new FormData();
        formData.append('fullname', userData.fullname);
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', userData.role);
        formData.append('sex', userData.sex);
        if (userData.profilePhoto) {
            formData.append('profile_photo', userData.profilePhoto);
        }
        formData.append('phone_number', userData.phoneNumber);

        try {
            await axios.post('http://127.0.0.1:8000/api/eventusers/', formData);
            navigate('/home', { replace: true });
        } catch (error) {
            if (error.response && error.response.data) {
                const serverErrors = error.response.data;
                const fieldErrors = {};

                if (serverErrors.fullname) {
                    fieldErrors.fullname = serverErrors.fullname[0];
                }
                if (serverErrors.username) {
                    fieldErrors.username = serverErrors.username[0];
                }
                if (serverErrors.email) {
                    fieldErrors.email = serverErrors.email[0];
                }
                if (serverErrors.password) {
                    fieldErrors.password = serverErrors.password[0];
                }
                if (serverErrors.role) {
                    fieldErrors.role = serverErrors.role[0];
                }
                if (serverErrors.sex) {
                    fieldErrors.sex = serverErrors.sex[0];
                }
                if (serverErrors.profile_photo) {
                    fieldErrors.profile_photo = serverErrors.profile_photo[0];
                }
                if (serverErrors.phone_number) {
                    fieldErrors.phone_number = serverErrors.phone_number[0];
                }

                setErrors(fieldErrors);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="position-relative vh-100 d-flex justify-content-center align-items-center">
            <Card style={{ width: '40rem', background: 'linear-gradient(to bottom, #000080, #000000)' }} className="p-4 text-white text-center">
                <Card.Body>
                    <div className="d-flex flex-column align-items-center mb-4">
                        <h4 className="mt-2">Welcome to Event Pulse! <br/> Sign Up Now</h4>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleUserSignIn}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="fullname" className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullname"
                                        placeholder="Full Name"
                                        value={userData.fullname}
                                        onChange={handleChange}
                                        isInvalid={!!errors.fullname}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={userData.username}
                                        onChange={handleChange}
                                        isInvalid={!!errors.username}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        isInvalid={!!errors.password}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="role" 
                                        value={userData.role} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.role}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="speaker">Speaker</option>
                                        <option value="sponsor">Sponsor</option>
                                        <option value="attendee">Attendee</option>
                                        <option value="exhibitor">Exhibitor</option>
                                        {/* <option value="admin">Admin</option>
                                        <option value="event_organizer">Event Organizer</option> */}
                                        <option value="reviewer">Reviewer</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="sex" className="mb-3">
                                    <Form.Label>Sex</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="sex" 
                                        value={userData.sex} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.sex}
                                        required
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.sex}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="profilePhoto" className="mb-3">
                                    <Form.Label>Profile Photo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                        isInvalid={!!errors.profile_photo}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.profile_photo}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="phoneNumber" className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={userData.phoneNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errors.phone_number}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="w-100">Sign Up</Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/" className="text-white">
                            Already registered? Login
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Signup;
