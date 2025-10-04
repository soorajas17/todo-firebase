import React, { useEffect, useState } from 'react'
import { db } from '../fireBase'
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore'
import { Modal, Button } from 'react-bootstrap';

function TodoApp() {

  const [taskData, setTaskData] = useState([])
  const [addTask, setAddTask] = useState("")
  const [editingId, setEditingId] = useState(null)
  const todoCollectionRef = collection(db, "todos")
  const [deleteId, setDeleteId] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true); setDeleteId(id);
  }


  // gettask
  const getTask = async () => {
    const data = await getDocs(todoCollectionRef)
    const filteredData = data.docs.map((doc) => (
      {
        ...doc.data(),
        id: doc.id
      }
    ))
    setTaskData(filteredData)
  }
  useEffect(() => {
    getTask()
  }, [])

  // Addtask
  const postData = async (e) => {
    e.preventDefault();
    if (addTask.trim()) {
      try {
        await addDoc(todoCollectionRef, {
          task: addTask,
          completed: false
        })
        setAddTask("");
        getTask();
      } catch (err) {
        console.error("Error adding document: ", err);
      }
    }
  }

  // toggle
  const toggleComplete = async (id, currentStatus) => {
    try {
      const taskDoc = doc(db, "todos", id);
      await updateDoc(taskDoc, {
        completed: !currentStatus
      })
      getTask();
    } catch (err) {
      console.error("Error updating checkbox: ", err);
    }
  }

  // editTask
  const updateTask = async () => {
    try {
      const taskDoc = doc(db, "todos", editingId);
      await updateDoc(taskDoc, {
        task: addTask
      })
      setAddTask("")
      setEditingId(null);
      getTask();
    } catch (err) {
      console.error("Error editing task:", err);
    }
  }

  const editTask = async (id) => {
    const taskDoc = doc(db, "todos", id);
    const task = await getDoc(taskDoc);
    console.log(task.id);
    console.log(task.data);
    setAddTask(task.data().task)
    setEditingId(task.id)
  };


  // delete
  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "todos", id);
      await deleteDoc(taskDoc);
      getTask()
      setAddTask("");
      setEditingId(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh"  }} className=' container d-flex justify-content-center align-items-center'>
      <div className="border p-4 rounded shadow" style={{ width: '350px', backgroundColor: '#F1F3F4' }} >
        <h1  className='text-center mb-4 '>Todo.</h1>
        <form  onSubmit={(e) => {
          e.preventDefault()
          editingId ? updateTask() : postData(e);
        }} className='d-flex justify-content-between'>
          <input value={addTask} onChange={(e) => setAddTask(e.target.value)} type="text" className='form-control me-2' placeholder='Enter task' />
          <button type="submit" className={`btn ${editingId ? 'btn-success' : 'btn-primary'}`}>
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this task?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={async () => {
              await deleteTask(deleteId)
              setShow(false)
            }}>Delete</Button>
          </Modal.Footer>
        </Modal>

        {
          taskData.map((item => (
            <div key={item.id} className='border mt-3 form-control'>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <input type="checkbox" className="me-2" checked={item.completed} onChange={() => toggleComplete(item.id, item.completed)} />
                  <span style={{
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? '#6c757d' : 'black'
                  }}>{item.task}</span>
                </div>

                <div >
                  <i onClick={() => { if (!item.completed) editTask(item.id) }} className="fas fa-edit me-3" style={{
                    cursor: 'pointer',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? '#6c757d' : 'black'
                  }}></i>
                  <i onClick={() => handleShow(item.id)} className="fas fa-trash-alt" style={{ cursor: 'pointer' }}></i>
                </div>
              </div>
            </div>
          )))
        }

      </div>
    </div>
  )
}

export default TodoApp
