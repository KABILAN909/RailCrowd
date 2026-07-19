function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(to right, #E3F2FD, #FFFFFF)",
        padding: "100px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          color: "#1565C0",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Predict. Plan. Travel Smart.
      </h1>

      <p
        style={{
          fontSize: "24px",
          color: "#555",
          maxWidth: "800px",
          margin: "0 auto",
          lineHeight: "1.8",
        }}
      >
        AI-powered railway crowd prediction that helps passengers
        choose less crowded trains, travel comfortably, and plan
        smarter journeys.
      </p>

      <button
        style={{
          marginTop: "40px",
          backgroundColor: "#1565C0",
          color: "white",
          padding: "15px 35px",
          border: "none",
          borderRadius: "8px",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        🔍 Search Trains
      </button>
    </section>
  );
}

export default Hero;