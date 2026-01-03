import ProfileForm from "../../components/ui/ProfileForm";

const UserProfile = ({ selectedOption }) => {
  return (
    <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
      <div className="">
        <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
        <p className="text-sm text-[var(--primary-text-muted)]">
          {selectedOption.subheading}
        </p>
      </div>

      <div className="mt-4">
        <ProfileForm />
      </div>
    </div>
  );
};

export default UserProfile;
