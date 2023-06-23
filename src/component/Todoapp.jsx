import React from "react";

export default function Todoapp() {

    const [todos, setTodos] = React.useState([])

    const [loading, setloading] = React.useState(false)

    const [err, setErr] = React.useState(null)

    const [todoinpval, settodoInpval] = React.useState('')

    const [authinpval, setAuthval] = React.useState('')

    const [page, setpage] = React.useState(1)


    React.useEffect(() => {
        fetchtodos()
    }, [page])



    if (loading) {
        return <div> <img src="https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif" alt="Loading ...." /></div>
    }

    if (err) {
        return <div>Error Occur</div>
    }


    function fetchtodos() {

        setloading(true)
        setErr(null)

        fetch(`http://localhost:4500/todos?_page=${page}&_limit=4`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
                setloading(false)
                setTodos(data)

            })
            .catch((err) => {
                setErr('some error occur')
            })



    }

    const toggleStatus = (id, status) => {

        fetch(`http://localhost:4500/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ status: !status })
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
                fetchtodos()
            })
            .catch((err) => {
                console.log(err)
                setErr('error occur')
            })

    }


    const removeTodo = (id) => {

        fetch(`http://localhost:4500/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
                fetchtodos()
            })
            .catch((err) => {
                console.log(err)
            })

    }



    function Rendertodo({ todo }) {

        const todoitems = todo.map((todo) => {
            return <div className="todocard">

                <p>Task-Name  : - {todo.title}</p>
                <p>Author-Name : - {todo.author}</p>
                <p >Task-Status : - {todo.status ? "Completed" : "Pending"}</p>
                <button onClick={() => toggleStatus(todo.id, todo.status)} data-id={todo.id}>Toggle</button>
                <button onClick={() => removeTodo(todo.id)} >Delete</button>

            </div>
        })
        return todoitems


    }


    const createTodo = () => {

        const todotask = {
            title: todoinpval,
            author: authinpval,
            status: false
        }

        console.log("data received", todotask)

        fetch(`http://localhost:4500/todos`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(todotask)
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log("task bna", data)
                setTodos(data)
                fetchtodos()
            })
            .catch((err) => {
                console.log(err)
            })


    }


    return <>

        <div id="todobox">

            <input value={todoinpval} onChange={(e) => settodoInpval(e.target.value)} placeholder="Add Todo from Here" style={{ textAlign: 'center', width: "200px", padding: "7px", margin: '15px' }} />

            <input value={authinpval} onChange={(e) => setAuthval(e.target.value)} placeholder="Add Author Name Here" style={{ textAlign: 'center', width: "200px", padding: "7px", margin: '15px' }} />

            <button onClick={createTodo} style={{ backgroundColor: "#007bff", color: 'white', width: "100px", padding: "7px", margin: '15px' }}>Add Todo</button>

        </div>

        <div id="paginatebtncontrol">

            <button disabled={page===1} onClick={()=>setpage(page-1)}>Prev</button>
            <button onClick={()=>setpage(page+1)}>Next</button>

        </div>


        <div id="todoitems">

            <Rendertodo todo={todos} />
        </div>
    </>



}


