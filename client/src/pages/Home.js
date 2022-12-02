import React from 'react';
// import { useQuery } from '@apollo/client';
import "../styling/Home.css"


import { QUERY_USERS } from '../utils/queries';

const Home = () => {
  // const { loading, data } = useQuery(QUERY_USERS);
  // const users = data?.users || [];

  // return (
  //   <main>
  //     <div className="flex-row justify-center">
  //       <div className="col-12 col-md-10 my-3">
  //         {loading ? (
  //           <div>Loading...</div>
  //         ) : (
  //           <UserList
  //             profiles={profiles}
  //             title="Here's the current roster of friends..."
  //           />
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // );
  return (<div>
  <center><h1><i>FIRST BASE</i></h1>
  <img src = "https://img.freepik.com/premium-vector/couple-hands-with-love-heart-shape-marry-marriage-affection-wedding-valentine-romantic-logo_358185-399.jpg?w=2000" alt = "projectlogo"></img>
  </center>
  </div>)
};

export default Home;
