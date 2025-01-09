<template>
    <div class="not-found">
      <div class="content">
        <h1>404</h1>
        <p>Lo sentimos, no pudimos encontrar la página que buscas.</p>
        <router-link to="/home" class="btn">Volver al inicio</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #4c6ef5, #15aabf);
    color: white;
    font-family: "Arial", sans-serif;
    text-align: center;
  }
  
  .content {
    background: rgba(0, 0, 0, 0.3);
    padding: 30px 50px;
    border-radius: 10px;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.8s ease-in-out;
  }
  
  h1 {
    font-size: 8rem;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .btn {
    display: inline-block;
    font-size: 1.2rem;
    background: #ff6b6b;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
  }
  
  .btn:hover {
    background: #fa5252;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  