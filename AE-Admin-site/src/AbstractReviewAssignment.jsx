import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Alert } from 'react-bootstrap';

const AbstractReviewAssignment = () => {
    const [abstracts, setAbstracts] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [selectedAbstract, setSelectedAbstract] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch abstracts
        fetch('http://127.0.0.1:8000/api/abstracts/')
            .then(response => response.json())
            .then(data => setAbstracts(data));

        // Fetch reviewers
        fetch('http://127.0.0.1:8000/api/reviewers/')
            .then(response => response.json())
            .then(data => setReviewers(data));
    }, []);

    const handleAssignReviewer = () => {
        if (selectedReviewer && selectedAbstract) {
            fetch(`http://127.0.0.1:8000/api/reviewers/${selectedAbstract.id}/assign_reviewer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewer_id: selectedReviewer.id }),
            })
                .then(response => {
                    if (response.ok) {
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                    } else {
                        return response.json().then(data => {
                            setErrorMessage(data.error);
                            setShowError(true);
                            setTimeout(() => setShowError(false), 3000);
                        });
                    }
                })
                .catch(error => {
                    setErrorMessage(error.toString());
                    setShowError(true);
                    setTimeout(() => setShowError(false), 3000);
                });
        }
    };

    return (
        <div>
            <h1>Assign Reviewer to Abstract</h1>
            {showSuccess && <Alert variant="success">Reviewer assigned successfully!</Alert>}
            {showError && <Alert variant="danger">Failed to assign reviewer: {errorMessage}</Alert>}
            <div className="d-flex justify-content-around">
                <div>
                    <h2>Abstracts</h2>
                    {abstracts.map(abstract => (
                        <Card key={abstract.id} className="mb-3" onClick={() => setSelectedAbstract(abstract)}>
                            <Card.Body>
                                <Card.Title>{abstract.title}</Card.Title>
                                <Card.Text>{abstract.summary}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <div>
                    <h2>Reviewers</h2>
                    {reviewers.map(reviewer => (
                        <Card key={reviewer.id} className="mb-3" onClick={() => setSelectedReviewer(reviewer)}>
                            <Card.Body>
                                <Card.Title>{reviewer.name}</Card.Title>
                                <Card.Text>Status: {reviewer.status}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            <Button variant="primary" onClick={handleAssignReviewer} className="mt-3">Assign Reviewer</Button>
        </div>
    );
};

export default AbstractReviewAssignment;
