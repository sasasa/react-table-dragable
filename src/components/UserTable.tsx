import { useEffect, useState } from "react";

interface UserType {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const UserTable = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = (await response.json()) as Array<UserType>;
      setUsers(users);
    };
    getUsers();
  }, []);

  const dragStart = (index: number) => {
    setDragIndex(index);
  };

  const dragEnter = (index: number) => {
    if (!dragIndex) return;
    if (index === dragIndex) return;
    setUsers((prevUsers) => {
      let newUsers = [...prevUsers];
      const deleteElement = newUsers.splice(dragIndex, 1)[0];
      newUsers.splice(index, 0, deleteElement);
      return newUsers;
    });
    setDragIndex(index);
  };

  const dragEnd = () => {
    console.log("ここにサーバへの並び替え後のデータ送信処理を追加");
    setDragIndex(null);
    console.table(users);
  };

  return (
    <div style={{ margin: "2em" }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ユーザ名</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              draggable={true}
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={dragEnd}
              className={index === dragIndex ? "dragging" : ""}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
