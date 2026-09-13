import React from "react";

function Team() {
    return (
        <div className='container'>
            <div className="row p-3 mt-5 mb-5 border-top">
                <h1 className='text-center'>
                    People
                </h1>
            </div> 
            <div className="row p-3 text-muted" style={{lineHeight:"1.8", fontSize:"1.2em"}}> 
                <div className='col-6 p-5 text-center'>
                    <img src="/Media/Images/nithinKamath.jpg" style={{borderRadius:"100%", width:"50%"}}></img>
                    <h4 className="mt-3">Nitin Kamath</h4>
                    <h6>Founder, CEO</h6>
                </div>
                <div className='col-6 p-3'>  
                    <p>
                       Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade-long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.</p>
                       <p>
                         He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC). </p> 
                         <p>
                            Playing basketball is his zen.
                            </p>
                            <p>
                                 Connect on <a href="">Homepage</a> / <a href="">TradingQnA </a>/ <a href="">Twitter</a>. 
                        </p>
                </div>
            </div>

            <div className="container-fluid row mt-2" id="class">
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/nikhil.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Nikhil Kamath</h4>
                    <h6>Co-founder & CEO</h6>
                    
                </div>
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/kailash.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Dr. Kailash Nadh</h4>
                    <h6>CTO</h6>
                </div>
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/venu.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Venu Madhav</h4>
                    <h6>COO</h6>
                </div>
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/seema.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Seema Patil</h4>
                    <h6>Director</h6>
                </div>
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/karthik.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Karthik Rangappa</h4>
                    <h6>Chief of Education</h6>
                </div>
                <div className="col-4 p-5 text-center">
                    <img src="/Media/Images/Austin.jpg" style={{borderRadius:"100%", width:"80%"}}></img>
                    <h4>Austin Prakesh</h4>
                    <h6>Director Strategy</h6>
                </div>
            </div>
        </div>
    )
} 

export default Team; 