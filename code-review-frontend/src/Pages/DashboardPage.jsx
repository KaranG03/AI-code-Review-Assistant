import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import History from '../components/History';

function DashboardPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <FileUpload />
        <hr style={{ margin: '2rem 0' }} />
        <History />
      </main>
    </div>
  );
}

export default DashboardPage;