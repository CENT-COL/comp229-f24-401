import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const apiUrl = '/api';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${apiUrl}/projects`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }
                setProjects(data);
            } catch (error) {
                console.error(`Error fetching projects: ${error}`);
            }
        }

        fetchProjects();
    }, [apiUrl]);

    const handleDelete = async (projectId) => {

        const token = localStorage.getItem('token');
            
        if(!token) { 
            navigate('/login');
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error deleting project');
            }

            setProjects((prevProjects) => prevProjects.filter(project => project._id !== projectId));

        } catch (error) {
            console.error(`Error deleting project: ${error}`);
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">
                Projects
            </h1>
            <button className="btn btn-primary mb-3" onClick={() => navigate('/project-details')}>
                Create New Project
            </button>

            {projects.length > 0 ? (

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project._id}>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                                <td>{new Date(project.endDate).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-secondary mr-2"
                                        onClick={() => navigate(`/project-details/${project._id}`)}
                                    >Update</button>
                                    <button className="btn btn-danger"
                                        onClick={() => handleDelete(project._id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            ) : (

                <p className="text-center">No projects available</p>

            )}
        </div>
    )
}

export default ProjectList;