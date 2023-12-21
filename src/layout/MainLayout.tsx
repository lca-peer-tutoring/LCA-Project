import PageNavbar from "../components/PageNavbar";

function MainLayout({ children }) {
  return (
    <div>
      <PageNavbar />
      <div>{children}</div>
    </div>
  );
}

export default MainLayout;
