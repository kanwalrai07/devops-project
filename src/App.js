import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Row, Col, Card, Form, Button, ListGroup, Badge, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  
  // API Data States
  const [apiTodos, setApiTodos] = useState([]);
  const [apiPosts, setApiPosts] = useState([]);
  const [apiUsers, setApiUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('local-todos');

  const categories = ['personal', 'work', 'shopping', 'health', 'other'];
  const priorities = ['low', 'medium', 'high'];

  // Load local todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save local todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Fetch API data
  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [todosRes, postsRes, usersRes] = await Promise.all([
          axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
          axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
          axios.get('https://jsonplaceholder.typicode.com/users?_limit=5')
        ]);

        setApiTodos(todosRes.data);
        setApiPosts(postsRes.data);
        setApiUsers(usersRes.data);
      } catch (err) {
        setError('Error fetching API data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  // Local Todo Functions
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
      category,
      priority,
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setDueDate('');
    setCategory('personal');
    setPriority('medium');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Utility Functions
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return colors[priority] || 'primary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'overdue') return isOverdue(todo.dueDate) && !todo.completed;
    return true;
  });

  // API Data Display Components
  const ApiDataSection = ({ title, data, renderItem }) => (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {data.map(renderItem)}
        </ListGroup>
      </Card.Body>
    </Card>
  );

  return (
    <div className="App">
      <Navbar bg="orange-theme" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Enhanced Todo App with API</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => setFilter('all')} active={filter === 'all'}>All</Nav.Link>
              <Nav.Link onClick={() => setFilter('active')} active={filter === 'active'}>Active</Nav.Link>
              <Nav.Link onClick={() => setFilter('completed')} active={filter === 'completed'}>Completed</Nav.Link>
              <Nav.Link onClick={() => setFilter('overdue')} active={filter === 'overdue'}>Overdue</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 orange-tabs"
        >
          <Tab eventKey="local-todos" title="Local Todos">
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h2 className="text-center mb-4 text-orange">My Enhanced Todo List</h2>
                    
                    {/* Add Todo Form */}
                    <Form onSubmit={handleAddTodo} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Add a new todo..."
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          className="orange-focus"
                        />
                      </Form.Group>
                      
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="text-orange">Due Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="orange-focus"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="text-orange">Category</Form.Label>
                            <Form.Select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="orange-focus"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="text-orange">Priority</Form.Label>
                            <Form.Select
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                              className="orange-focus"
                            >
                              {priorities.map(p => (
                                <option key={p} value={p}>
                                  {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end">
                        <Button type="submit" variant="orange" className="orange-button">
                          Add Todo
                        </Button>
                      </div>
                    </Form>

                    {/* Todo List */}
                    <ListGroup>
                      {filteredTodos.map(todo => (
                        <ListGroup.Item
                          key={todo.id}
                          className={`todo-item ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''}`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center flex-grow-1">
                              <Form.Check
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="me-3 orange-checkbox"
                              />
                              <div className={`todo-content ${todo.completed ? 'completed-todo' : ''}`}>
                                <div className="todo-text">{todo.text}</div>
                                <div className="todo-details">
                                  <Badge bg={getPriorityColor(todo.priority)} className="me-2">
                                    {todo.priority}
                                  </Badge>
                                  <Badge bg="orange-theme" className="me-2">
                                    {todo.category}
                                  </Badge>
                                  {todo.dueDate && (
                                    <small className={`due-date ${isOverdue(todo.dueDate) ? 'text-danger' : 'text-orange'}`}>
                                      Due: {formatDate(todo.dueDate)}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline-orange"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="ms-2"
                            >
                              Delete
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    {filteredTodos.length === 0 && (
                      <p className="text-center text-muted mt-3">
                        {filter === 'all' 
                          ? 'No todos yet. Add some tasks to get started!'
                          : `No ${filter} todos found.`}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="api-data" title="API Data">
            <Row>
              <Col>
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="orange" />
                    <p className="mt-3 text-orange">Loading API data...</p>
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <>
                    {/* API Todos */}
                    <ApiDataSection
                      title="API Todos"
                      data={apiTodos}
                      renderItem={(todo) => (
                        <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            <Form.Check
                              type="checkbox"
                              checked={todo.completed}
                              readOnly
                              inline
                              className="orange-checkbox"
                            />
                            <span className={todo.completed ? 'completed-todo' : ''}>
                              {todo.title}
                            </span>
                          </div>
                          <Badge bg="orange-theme">User ID: {todo.userId}</Badge>
                        </ListGroup.Item>
                      )}
                    />

                    {/* API Posts */}
                    <ApiDataSection
                      title="API Posts"
                      data={apiPosts}
                      renderItem={(post) => (
                        <ListGroup.Item key={post.id}>
                          <h6 className="text-orange">{post.title}</h6>
                          <p className="mb-0 text-muted">{post.body}</p>
                          <small className="text-orange">User ID: {post.userId}</small>
                        </ListGroup.Item>
                      )}
                    />

                    {/* API Users */}
                    <ApiDataSection
                      title="API Users"
                      data={apiUsers}
                      renderItem={(user) => (
                        <ListGroup.Item key={user.id}>
                          <h6 className="text-orange">{user.name}</h6>
                          <p className="mb-0">Email: {user.email}</p>
                          <small className="text-muted">Company: {user.company.name}</small>
                        </ListGroup.Item>
                      )}
                    />
                  </>
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
