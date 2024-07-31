import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProjectsBar = () => {

  const [projects, setProjects] = useState([]);
  const ownerid = localStorage.getItem('ownerID')

  useEffect(() => {
    if (!ownerid) return;  // Guard clause to prevent fetch if ownerid is not available

    axios.get(`http://localhost:5000/projects?id=${ownerid}`)
        .then(response => {
            // Log the response data for debugging
            console.log('Response Data:', response.data);

            // Extract names from all projects
            const projectNames = response.data.map(project => project.name);
            console.log('Extracted Names:', projectNames);

            // Prevent duplicates by filtering out existing projects
            const filteredProjectNames = projectNames.filter(name => !projects.includes(name));
            console.log('Filtered Names:', filteredProjectNames);

            // Update state with new projects
            if (filteredProjectNames.length > 0) {
                setProjects(prevProjects => [...prevProjects, ...filteredProjectNames]);
            }
        })
        .catch(error => {
            console.log(error);
        });
}, [ownerid]);  // Dependency array includes ownerid to run effect when it changes
  // Dependency array includes ownerid to run effect when it changes


  const handleCreateProject = () => {
    const newProjectTitle = prompt("Enter new project title")
    if (newProjectTitle) {
      axios.post('http://localhost:5000/createproject', { name: newProjectTitle, owner: ownerid, collaborators: [] })
      .then(function (response) {
        console.log(response.data)
        setProjects([...projects, newProjectTitle])
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }

  return (
    <div style={{ backgroundColor: "#000000", color: "#FFFFFF", padding: "1rem", marginTop: "1rem", marginBottom: "1rem", border: "1px solid #FFFFFF", borderRadius: "1rem", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {projects.map((project, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{project}</h3>
        </div>
      ))}
      <div>
        <button onClick={()=>{handleCreateProject()}}>Add create projects</button>
      </div>
    </div>
  )
}

export default ProjectsBar
