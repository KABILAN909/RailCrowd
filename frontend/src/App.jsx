function App() {
  return (
    <div
      style={{
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          textAlign: "center",
          width: "500px",
        }}
      >
        <h1
          style={{
            color: "#1E88E5",
            fontSize: "40px",
            marginBottom: "10px",
          }}
        >
          RailCrowd
        </h1>

        <h2>Predict. Plan. Travel Smart.</h2>

        <p>
          Welcome to the RailCrowd Project.
          <br />
          AI Powered Railway Crowd Prediction System.
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1E88E5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;