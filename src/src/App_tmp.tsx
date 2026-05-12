import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>ファイルアップロード</div>
        <FileUpload />
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f7f7f8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    fontFamily: "sans-serif",
  },
  container: {
    width: "800px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #eee",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default App;