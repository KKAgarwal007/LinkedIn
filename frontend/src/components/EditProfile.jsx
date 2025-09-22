import React, { useContext, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { UserContextData } from '../context/UserContext';
import { IoCameraOutline } from "react-icons/io5";
import dp from '../assets/profile.png';
import { FiPlus } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';


function EditProfile() {
  let {UserData, SetUserData, edit, setEdit } = useContext(UserContextData);
  let {serverUrl} = useContext(authDataContext);
  let [firstName, setFirstName] = useState(UserData.firstName || "");
  let [lastName, setLastName] = useState(UserData.lastName || "");
  let [username, setUsername] = useState(UserData.username || "");
  let [headline, setHeadline] = useState(UserData.headline || "");
  let [location, setLocation] = useState(UserData.location || "");
  let [gender, setGender] = useState(UserData.gender || "");
  let [skills, setSkills] = useState(UserData.skills || []);
  let [newSkill, setNewSkill] = useState("");
  let [education, setEducation] = useState(UserData.education || []);
  let [newEducation, setNewEducation] = useState({
        college: "",
        degree: "",
        fieldOfStudy: ""
        
  });  
  let [experience, setExperience] = useState(UserData.experience || []);
  let [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: ""
        
  });      
  let profileImage = useRef();
  let coverImage = useRef();

  let [frontendProfileImage, setFrontendProfileImage] = useState(UserData.profileImage || dp);
  let [backendProfileImage, setBackendProfileImage] = useState(null);

  

  let [frontendCoverImage, setFrontendCoverImage] = useState(UserData.coverImage || null);
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let [saving, setSaving] = useState(false);

  const HandleSaveDetails = async ()=>{
    setSaving(true)
    try {

      
      let formdata = new FormData();

      formdata.append("firstName",firstName);
      formdata.append("lastName",lastName);
      formdata.append("username",username);
      formdata.append("headline",headline);
      formdata.append("location",location);
      formdata.append("gender",gender);
      formdata.append("skills",JSON.stringify(skills));
      formdata.append("education",JSON.stringify(education));
      formdata.append("experience",JSON.stringify(experience));
      if(backendProfileImage){
        formdata.append("profileImage",backendProfileImage);
      }
      if(backendCoverImage){
        formdata.append("coverImage",backendCoverImage);
      }

      let result = await axios.put(serverUrl + "/user/updateuser",formdata,{withCredentials:true})
      SetUserData(result.data);
      setEdit(false);
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  }
  

  

  function addSkill(e){
    e.preventDefault();
    if(newSkill && !skills.includes(newSkill)){
      setSkills([...skills,newSkill]);
    }
    setNewSkill("")
  }


  function removeSkill(skill){
    if(skills.includes(skill)){
      setSkills(skills.filter((s)=>s!==skill))
    }
  }

    function addEducation(e){
    e.preventDefault();
    if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy){
      setEducation([...education,newEducation]);
    }
    setNewEducation({
        college: "",
        degree: "",
        fieldOfStudy: ""
    })
  }

  
  function removeEducation(edu){
    if(education.includes(edu)){
      setEducation(education.filter((e)=>e!==edu))
    }
  }

      function addExperience(e){
    e.preventDefault();
    if(newExperience.title && newExperience.company && newExperience.description){
      setExperience([...experience,newExperience]);
    }
    setNewExperience({
        title: "",
        company: "",
        description: ""
    })
  }

  
  function removeExperience(exp){
    if(experience.includes(exp)){
      setExperience(education.filter((e)=>e!==exp))
    }
  }

  function HandleProfileImage(e){
    let file = e.target.files[0];
    setBackendProfileImage(file);
    let decoded = URL.createObjectURL(file);
    setFrontendProfileImage(decoded);
  }

  function HandleCoverImage(e){
    let file = e.target.files[0];
    setBackendCoverImage(file);
    let decoded = URL.createObjectURL(file);
    setFrontendCoverImage(decoded);
  }

  return (
    <div className='w-full h-[100vh] fixed top-0 left-0 z-20 flex justify-center items-center'>

      <input type="file" accept='image/*' hidden ref={profileImage} onChange={(e)=>HandleProfileImage(e)}/>
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={(e)=>HandleCoverImage(e)}/>


      <div className='w-full h-full absolute opacity-[0.7] bg-gray-600'>
      </div>
      <div className='max-w-[450px] w-[90%] h-[600px] bg-white relative z-30 shadow-lg rounded-lg p-[20px] overflow-auto'>
        <div className='absolute top-[15px] right-[20px]'><RxCross2 className='w-[24px] h-[24px] text-gray-600 font-bold cursor-pointer' onClick={() => setEdit(false)} /></div>
        <div className='w-full h-[150px] bg-gray-500 flex justify-center items-center rounded overflow-hidden mt-[30px] relative'
       >

          <img src={frontendCoverImage} alt=""/>
          <div className='absolute right-[20px] top-[15px] text-gray-800 cursor-pointer'  onClick={()=>coverImage.current.click()
          }>
            <IoCameraOutline className='w-[24px] h-[24px] text-white' />
          </div>

        </div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[145px] left-[50px]'>
          <img src={frontendProfileImage} alt="" className='w-full h-full' />

        </div>
        <div className='w-[20px] h-[20px] bg-blue-500 absolute top-[180px] left-[105px] rounded-full flex justify-center items-center cursor-pointer'onClick={()=>profileImage.current.click()}>
          <FiPlus className='text-white' />
        </div>
        <div className='w-full flex flex-col gap-[20px] mt-[30px] justify-center items-center'>
          <input type="text" placeholder='Firstname' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
          <input type="text" placeholder='Lastname' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
          <input type="text" placeholder='username' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <input type="text" placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
          <input type="text" placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={location} onChange={(e)=>setLocation(e.target.value)}/>
          <input type="text" placeholder='gender (male/female/other)' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={gender} onChange={(e)=>setGender(e.target.value)}/>

          <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
            <h1 className='text-[19px] font-semibold'>Skills</h1>
            {skills && <div>
              {skills.map((skill,index) =>(
                <div key={index} className='w-full h-[40px] border-[1px] border-gray-800 bg-gray-200 p-[5px] rounded-lg flex justify-between items-center'><span>{skill}</span><RxCross2 className='w-[20px] h-[20px] text-gray-600 font-bold cursor-pointer' onClick={()=>removeSkill(skill)}/> </div>
              ))}
              </div>}
              <div className='flex flex-col gap-[10px] items-start'>
                <input type="text" placeholder='add a new skill' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newSkill} onChange={(e)=>setNewSkill(e.target.value)}/>
                <button className='w-[95%] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={addSkill}>Add</button>
              </div>
          </div>

           <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
            <h1 className='text-[19px] font-semibold'>Education</h1>
            {education && <div>
              {education.map((edu,index) =>(
                <div key={index} className='w-full border-[1px] border-gray-800 bg-gray-200 p-[5px] rounded-lg flex justify-between items-center'>
                  <div className='flex flex-col justify-center items-start'>
                    <span>College: {edu.college}</span>
                    <span>Degree: {edu.degree}</span>
                    <span>Field of Study: {edu.fieldOfStudy}</span>
                  </div>
                 
                
                <RxCross2 className='w-[20px] h-[20px] text-gray-600 font-bold cursor-pointer' onClick={()=>removeEducation(edu)}/> </div>
              ))}
              </div>}
              <div className='flex flex-col gap-[10px] items-start'>
                <input type="text" placeholder='College' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})}/>
                <input type="text" placeholder='Degree' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})}/>
                <input type="text" placeholder='fieldOfStudy' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})}/>
                <button className='w-[95%] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={addEducation}>Add</button>
              </div>
          </div>


              <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
            <h1 className='text-[19px] font-semibold'>Experience</h1>
            {experience && <div>
              {experience.map((exp,index) =>(
                <div key={index} className='w-full border-[1px] border-gray-800 bg-gray-200 p-[5px] rounded-lg flex justify-between items-center'>
                  <div className='flex flex-col justify-center items-start'>
                    <span>Title: {exp.title}</span>
                    <span>Company: {exp.company}</span>
                    <span>Description: {exp.description}</span>
                  </div>
                 
                
                <RxCross2 className='w-[20px] h-[20px] text-gray-600 font-bold cursor-pointer' onClick={()=>removeExperience(exp)}/> </div>
              ))}
              </div>}
              <div className='flex flex-col gap-[10px] items-start'>
                <input type="text" placeholder='Title' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})}/>
                <input type="text" placeholder='Company' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}/>
                <input type="text" placeholder='Description' className='w-full h-[50px] outline-none border-gray-600 px-[10px] text-[18px] border-2 rounded-lg' value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})}/>
                <button className='w-[95%] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={addExperience}>Add</button>
              </div>
          
          </div>
            <button className='w-full flex items-center justify-center bg-blue-500 p-[12px] rounded-full mt-[20px] text-white font-semibold text-[18px]' onClick={HandleSaveDetails} disabled={saving}>{saving?"Saving...":"Save Profile"}</button>

        </div>
      </div>
    </div>
  )
}

export default EditProfile