function Avatar({
  person,
  size = 100,
}: {
  person: { name: string; imageId: string };
  size?: number;
}) {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt={person.name}
      width={size}
      height={size}
      style={{ margin: "20px", borderRadius: "50%" }}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="card"
      style={{
        width: "fit-content",
        margin: "5px",
        padding: "5px",
        fontSize: "20px",
        textAlign: "center",
        border: "1px solid #aaa",
        borderRadius: "20px",
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar person={{ name: "Lin Lanying", imageId: "1bX5QH6" }} size={100} />
    </Card>
  );
}
