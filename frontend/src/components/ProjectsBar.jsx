import React, { useState } from 'react'
import axios from 'axios'
import './ProjectsBar.css'

const ProjectsBar = () => {

  const [projects, setProjects] = useState([]);
  const [modal, showModal] = useState(false);
  const ownerid = localStorage.getItem('ownerID')
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [selectedProjectCollaborators, setSelectedProjectCollaborators] = useState([]);
  const [selectedProjectOwnerId, setSelectedProjectOwnerId] = useState('');

  const fetchProjects = () => {
    if (!ownerid) return;

    axios.get(`http://localhost:5000/projects?id=${ownerid}`)
      .then(response => {
        const projectNames = response.data.map(project => project.name);
        console.log(projectNames)   // Extract project names from response data
        const filteredProjectNames = projectNames.filter(name => !projects.includes(name)); // Filter out projects already in the list
        console.log('Filtered Names:', filteredProjectNames);
        if (filteredProjectNames.length > 0) {  // If there are projects to add to the list
          setProjects(prevProjects => [...prevProjects, ...filteredProjectNames]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCreateProject = () => {
    const newProjectTitle = prompt("Enter new project title")
    let newProjectCollaborators = new Array([])
    newProjectCollaborators = prompt("Enter only one collaborator's id")
    console.log(newProjectCollaborators)

    if (newProjectTitle) {
      axios.post('http://localhost:5000/createproject', { name: newProjectTitle, owner: ownerid, collaborators: [newProjectCollaborators] })
        .then(function (response) {
          console.log(response.data)
          setProjects([...projects, newProjectTitle])
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  const handleShowProjectDetails = (index) => {

    axios.get(`http://localhost:5000/projects?id=${ownerid}`)

      .then(res => {

        console.log(res)
        setSelectedProjectCollaborators(res.data[index].collaboratorsEmail)
        setSelectedProjectName(res.data[index].name)
        if(res.data[index].owner == ownerid){
            setSelectedProjectOwnerId('You')
        } else {
          setSelectedProjectOwnerId(res.data[index].ownerEmail)
        }
      })
      .catch(err => {
        console.log(err)
      })

    showModal(true)
  }

  return (
    <div style={{ backgroundColor: "#000000", color: "#FFFFFF", padding: "1rem", marginTop: "1rem", marginBottom: "1rem", border: "1px solid #FFFFFF", borderRadius: "1rem", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {projects.map((project, index) => (
        <div className='projects' key={index} style={{ marginBottom: "1rem" }}>
          <h3 onClick={() => { handleShowProjectDetails(index) }} style={{ marginBottom: "0.5rem" }}>{project}</h3>
        </div>
      ))}
      {modal && (
        <div className='modal'>
          <h3>Project name: {selectedProjectName}</h3>
          <ul>
            <li>Collaborators: {selectedProjectCollaborators}</li>
            <li>Owner: {selectedProjectOwnerId}</li>
          </ul>
        </div>
      )}
      <div>
        <button onClick={() => { fetchProjects() }}>Fetch projects</button>
        <button onClick={() => { handleCreateProject() }}>Add create projects</button>
      </div>
    </div>
  )
}

export default ProjectsBar
