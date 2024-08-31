import Image from "next/image";
import FormComponent from "./component/FormComponent";
import UserTable from "./component/UserTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-10">
      <h1>Redux Optimistic Caching Update</h1>
      <div className="flex  gap-5 w-full">
        <div>
          <FormComponent />
        </div>
        <div className="w-full">
          <UserTable />
        </div>
      </div>
    </main>
  );
}
