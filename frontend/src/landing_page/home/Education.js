import React from "react";

function Education() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col-6"> 
            <img src="media/images/education.svg" style={{width:"70%"}}/>
          <div className="row text-center">
            <div className="col p-3 border">
              <h1 className="mb-3">0</h1>
              <p>
                Free equity delivery and <br />
                direct mutul funds
              </p>
            </div>
            <div className="col p-3 border">
              <h1 className="mb-3">20</h1>
              <p>Free equity delivery and direct mutual funds</p>
            </div>
          </div>
        </div>
        <div className="col-4">
          <h1 className="mb-3  fs-2">Free and open market Education</h1>
          <p>
            Varsity, the largest online stock market education book in the world covering everything from the bascis to advanced trading
          </p>
          <a href="" className="mx-5" style={{ textDecoration: "none" }}>
            Versity<i class="fa-solid fa-right-long"></i>
          </a>
          <p className="mt-5"> 
            Trading Q & A, the most active trading and investment community in india for all your market related queries
          </p>
          <a href="" className="mx-5" style={{ textDecoration: "none" }}>
            Trading Q&A <i class="fa-solid fa-right-long"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Education;
