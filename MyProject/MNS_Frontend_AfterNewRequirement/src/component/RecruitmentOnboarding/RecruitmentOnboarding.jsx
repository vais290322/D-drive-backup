import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addCandidate, onboardCandidate, setError, updateCandidate } from "../../utils/recruitment/recruitmentSlice";
import { v4 as uuidv4 } from "uuid";


const RecruitmentOnboarding = () => {
    const dispatch=useDispatch();
    const {candidates,error}=useSelector((state)=>state.recruitment || {});
    const [email,setEmail]=useState("");
    const [phone,setPhone]=useState("");
    const [description,setDescription]=useState("");
    const [expectedSalary,setExpectedSalary]=useState("");

    useEffect(()=>{},[]);

    const handleAddCandidate=()=>{
        if(!email || !phone || !description || !expectedSalary){
           dispatch(setError("All fields are required")); 
           return;
        }
        const newCandidate={
            id:uuidv4(),
            email,
            phone,
            description,
            expectedSalary,
            onboarded:false,
         };

        dispatch(addCandidate(newCandidate));
        setEmail(""),setPhone(""),setDescription(""),setExpectedSalary("");

    }
    const handleUpdateCandidate=(id)=>{
        const updatedCandidate={
            id,
            email,
            phone,
            description,
            expectedSalary,
            onboarded:false
        };
        dispatch(updateCandidate(updatedCandidate))

    };
    const handleOnboardCandidate=(id)=>{
        if(window.confirm("Are you sure you want to onboard this candidate?")){
            dispatch(onboardCandidate(id));
            alert("Candidate onboarded successfully");
        }

    }
   return (
    <div>
    <h1>Recruitment Management</h1>
    {error && <p style={{ color: "red" }}>{error}</p>}
    <div>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Expected Salary" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
        <button onClick={handleAddCandidate}>Add Candidate</button>
    </div>
    <h2>Candidate List</h2>
    <ul>
        {candidates?.map((candidate) => (
            <li key={candidate.id}>
                <p>OID: {candidate.oid}</p>
                <p>Description: {candidate.description}</p>
                <p>Expected Salary: {candidate.expectedSalary}</p>
                <p>Status: {candidate.onboarded ? "Onboarded" : "Pending"}</p>
                <button onClick={() => handleUpdateCandidate(candidate.id)}>Update</button>
                <button onClick={() => handleOnboardCandidate(candidate.id)}>Onboard</button>
            </li>
        ))}
    </ul>
</div>
  )
}

export default RecruitmentOnboarding;