import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Nav, Navbar, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import './App.css'; // Custom CSS

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data for posts, comments, and users
    axios.all([
      axios.get('https://jsonplaceholder.typicode.com/posts'),
      axios.get('https://jsonplaceholder.typicode.com/comments'),
      axios.get('https://jsonplaceholder.typicode.com/users')
    ])
    .then(axios.spread((postsRes, commentsRes, usersRes) => {
      setPosts(postsRes.data);
      setComments(commentsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    }))
    .catch((err) => {
      setError('Error fetching data');
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Fetch API App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#posts">Posts</Nav.Link>
            <Nav.Link href="#comments">Comments</Nav.Link>
            <Nav.Link href="#users">Users</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <div>
            {/* Posts Section */}
            <h2 id="posts" className="text-center section-title">Posts</h2>
            <Row>
              {posts.map(post => (
                <Col md={4} key={post.id}>
                  <Card className="post-card mb-3 shadow-lg hover-card">
                    <Card.Body>
                      <Card.Title className="post-title">{post.title}</Card.Title>
                      <Card.Text className="post-text">{post.body}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Comments Section */}
            <h2 id="comments" className="text-center section-title">Comments</h2>
            <Row>
              {comments.slice(0, 6).map(comment => (
                <Col md={4} key={comment.id}>
                  <Card className="comment-card mb-3 shadow-lg hover-card">
                    <Card.Body>
                      <Card.Title>{comment.name}</Card.Title>
                      <Card.Text>{comment.body}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Users Section */}
            <h2 id="users" className="text-center section-title">Users</h2>
            <Row>
              {users.slice(0, 6).map(user => (
                <Col md={4} key={user.id}>
                  <Card className="user-card mb-3 shadow-lg hover-card">
                    <Card.Body>
                      <Card.Title>{user.name}</Card.Title>
                      <Card.Text>{user.email}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;
