import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Dropdown, DropdownButton, Form, ToggleButtonGroup, ToggleButton, Col, Row } from 'react-bootstrap';

function Assign() {
    const [freeReviewers, setFreeReviewers] = useState([]);
    const [submittedAbstracts, setSubmittedAbstracts] = useState([]);
    const [assignedAbstracts, setAssignedAbstracts] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const [selectedAbstract, setSelectedAbstract] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('table');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [freeReviewersData, submittedAbstractsData, assignedAbstractsData, reviewersData] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/free_reviewers/').then(res => res.json()),
                fetch('http://127.0.0.1:8000/api/submitted_abstracts/').then(res => res.json()),
                fetch('http://127.0.0.1:8000/api/assigned_abstracts/').then(res => res.json()),
                fetch('http://127.0.0.1:8000/api/reviewers/').then(res => res.json())
            ]);
            setFreeReviewers(freeReviewersData);
            setSubmittedAbstracts(submittedAbstractsData);
            setAssignedAbstracts(assignedAbstractsData);
            setReviewers(reviewersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const assignAbstract = async () => {
        if (!selectedReviewer || !selectedAbstract) {
            setMessage('Please select a reviewer and an abstract.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/assign_abstract/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewer_id: selectedReviewer, abstract_id: selectedAbstract })
            });

            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                fetchData();
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error assigning abstract:', error);
            setMessage('Error assigning abstract');
        }
    };

    const handleFileAction = (url, action) => {
        const link = document.createElement('a');
        link.href = url;
        if (action === 'view') {
            link.target = '_blank';
        } else if (action === 'download') {
            link.download = url.split('/').pop();
        } else if (action === 'openWithWPS') {
            link.href = `wps://open?url=${encodeURIComponent(url)}`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getReviewerNameById = (id) => {
        const reviewer = reviewers.find(reviewer => reviewer.id === id);
        return reviewer ? reviewer.name : 'Not Assigned';
    };

    const getImageUrl = (image) => {
        return image ? `http://127.0.0.1:8000${image}` : '';
    };

    return (
        <div className="container">
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>Assign Abstract to Reviewer</Card.Title>
                    {message && <p>{message}</p>}
                    <Form.Group controlId="selectReviewer">
                        <Form.Label>Select Free Reviewer</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedReviewer}
                            onChange={(e) => setSelectedReviewer(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select a reviewer</option>
                            {freeReviewers.map(reviewer => (
                                <option key={reviewer.id} value={reviewer.id}>{reviewer.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="selectAbstract" className="mt-3">
                        <Form.Label>Select Submitted Abstract</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedAbstract}
                            onChange={(e) => setSelectedAbstract(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select an abstract</option>
                            {submittedAbstracts.map(abstract => (
                                <option key={abstract.id} value={abstract.id}>{abstract.title}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" size="sm" className="mt-3" onClick={assignAbstract}>
                        Assign Abstract
                    </Button>
                </Card.Body>
            </Card>

            <ToggleButtonGroup type="radio" name="viewOptions" value={view} className="mt-3" onChange={val => setView(val)}>
                <ToggleButton id="tbg-radio-1" value="table" variant="outline-primary" size="sm">Table View</ToggleButton>
                <ToggleButton id="tbg-radio-2" value="card" variant="outline-primary" size="sm">Card View</ToggleButton>
            </ToggleButtonGroup>
            <h1>
                                    Assigned Abstract for Review Purpose
                                </h1>

            {view === 'table' ? (
                <Table responsive striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Reviewer</th>
                            <th>Document</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedAbstracts.map(abstract => (
                            <tr key={abstract.id}>
                                <td>{abstract.title}</td>
                                <td>Anonymous</td>
                                <td>{abstract.reviewer ? getReviewerNameById(abstract.reviewer) : 'Not Assigned'}</td>
                                <td>
                                    {abstract.document && (
                                        <DropdownButton id={`dropdown-document-${abstract.id}`} title="Options" size="sm">
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'view')}>View Document</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'download')}>Download Document</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'openWithWPS')}>Open with WPS</Dropdown.Item>
                                        </DropdownButton>
                                    )}
                                </td>
                                <td>
                                    {abstract.abstract_image && (
                                        <DropdownButton id={`dropdown-image-${abstract.id}`} title="Options" size="sm">
                                            <Dropdown.Item onClick={() => handleFileAction(getImageUrl(abstract.abstract_image), 'view')}>View Image</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(getImageUrl(abstract.abstract_image), 'download')}>Download Image</Dropdown.Item>
                                        </DropdownButton>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                
                <Row className="card-view mt-3">
                    {assignedAbstracts.map(abstract => (
                        <Col sm={6} md={4} lg={3} key={abstract.id}>
                            <Card className="mb-3">
                                
                                <Card.Body>
                                    <Card.Title>{abstract.title}</Card.Title>
                                    {abstract.abstract_image && (
                                    <Card.Img variant="top" src={getImageUrl(abstract.abstract_image)} alt="Abstract Image" />
                                )}
                                    <Card.Text>
                                        
                                    </Card.Text>
                                    {abstract.document && (
                                        <DropdownButton id={`dropdown-document-${abstract.id}`} title="Document Options" size="sm">
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'view')}>View Document</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'download')}>Download Document</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(abstract.document, 'openWithWPS')}>Open with WPS</Dropdown.Item>
                                        </DropdownButton>
                                    )}
                                    {abstract.abstract_image && (
                                        <DropdownButton id={`dropdown-image-${abstract.id}`} title="Image Options" size="sm" className="mt-2">
                                            <Dropdown.Item onClick={() => handleFileAction(getImageUrl(abstract.abstract_image), 'view')}>View Image</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFileAction(getImageUrl(abstract.abstract_image), 'download')}>Download Image</Dropdown.Item>
                                        </DropdownButton>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default Assign;
