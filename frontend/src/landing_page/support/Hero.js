import React from 'react';

function Hero() {
    return (
        <section className="container-fluid" id="supportHero">
            <div className="p-4" id="supportWrapper">
                <h4 className=" mt-4 fs-2">Support Portal</h4>
                <a href="" className="mx-5 fs-2" style={{textDecoration:"none"}}>Track Tickets</a>
            </div>
            <div className="row py-4 ms-5">
                <div className="col-6 p-5">
                    <h1 className='fs-3' style={{marginBottom:"20px"}}>Search for an answer or browse help topics to create a ticket</h1>
                    <input placeholder="Eg. how do I activate F&O, why is my order getting rejected."/>
                    <div className="mt-4">
                        <span><a href="">Track account opening</a></span>
                        <span><a href="">Track segment activation</a></span>
                        <span><a href="">Intraday margins</a></span>
                        <span><a href="">Kite user manual</a></span>
                    </div>
                </div> 
            <div className="col-6 p-5" style={{listStylePosition:"inside"}}> 
                <h1 style={{textAlign:"left", marginLeft:"120px"}}>Featured</h1>
                <ol style={{textAlign:"left", marginLeft:"70px"}}>
                    <li><a href="">Current Takeovers and Delisting - January 2024</a></li>
                    <li><a href="">Latest Intraday leverages - MIS & CO</a></li>
                </ol>
            </div>
        </div>
        </section>
    )
} 
export default Hero; 