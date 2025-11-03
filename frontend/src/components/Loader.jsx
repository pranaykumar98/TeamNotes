import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <ClipLoader color="#2563EB" size={70} speedMultiplier={0.9} />
    </div>
  );
}
