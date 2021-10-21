import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { PostDataAPI, FindDataAPI } from "../../API/fetchAPI";

// async function FindDataAPI(data, api) {
//   return fetch(`https://website-of-bakery.herokuapp.com${api}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${data.authorization}`,
//     },
//   }).then((data) => data.json());
// }

const Wrapper = styled.div`
  max-width: 1024px;
  min-height: 80vh;
  margin: 0 auto;
  padding: 12px;
`;

const Title = styled.h2`
  color: #333;
`;
const Content = styled.div`
  display: flex;
  align-items: flex-start;
  & + & {
    margin-top: 24px;
  }
  ${`@media screen and (max-width: 400px)`} {
    flex-direction: column;
  }
`;
const Column = styled.div`
  font-size: 20px;
  color: #917856;
  font-weight: bold;
  padding: 8px;
  white-space: nowrap;
`;

const Row = styled.input`
  padding: 8px;
  width: 100%;
  height: ${(props) => (props.as === "textarea" ? "200px" : "auto")};
  outline: none;
  background: rgb(201, 186, 152, 0.4);
  border: rgb(201, 186, 152, 0.4);
  border-radius: 4px;
  font-size: 20px;
  color: #917856;
  &:: placeholder {
    color: #917856;
    font-weight: bold;
  }
`;

const Submit = styled.div`
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  color: #917856;
  font-weight: bold;
  padding: 16px;
  background: white;
  border: 1px solid rgba(201, 186, 152, 0.9);
  margin: 0;
  margin-top: 36px;
  &: hover {
    color: white;
    background: rgba(201, 186, 152, 1.5);
    transition: all 0.5s ease;
  }
  margin-bottom: 18px;
`;

function Input({
  columnName,
  name,
  as,
  value,
  placeholder,
  discount,
  setDiscount
}) {
  const [val, setVal] = useState({value});
  const handleInputChange = (setVal, setDiscount, discount) => (event) => {
    discount[name] = event.target.value;
    setVal(event.target.value);
    setDiscount(discount);
  };

  return (
    <Content>
      <Column>{columnName}</Column>
      <Row
        name={name}
        as={as}
        value={val.value}
        onChange={handleInputChange(setVal, setDiscount, discount)}
        placeholder={placeholder}
      />
    </Content>
  );
}

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UpdateDiscountPage = () => {
  const { id } = useParams();
  const [discount, setDiscount] = useState({});

  useEffect(() => {
    FindDataAPI(
      { authorization: localStorage.getItem("token") },
      `/findDiscounts/${id}`
    ).then((data) => {
      const { Discount } = data;
      setDiscount(Discount);
    });
  }, []);

  const handleSummit = async (event) => {
    event.preventDefault();
    const res = await PostDataAPI(
      { data: discount, authorization: localStorage.getItem("token") },
      "/updateDiscounts"
    );
    if (res.success) {
      alert("成功");
    } else {
      alert(res.message);
    }
  };

  return (
    <div>
      <Wrapper>
        <Title>編輯運費規則</Title>
        <form onSubmit={handleSummit}>
          <Input
            columnName={"運費門檻："}
            name={"threshold"}
            value={discount.threshold}
            placeholder={"請輸入運費門檻"}
            discount={discount}
            setDiscount={setDiscount}
          />
          <Input
            columnName={"運費說明："}
            name={"desc"}
            as={"textarea"}
            value={discount.desc}
            placeholder={"請輸入運費說明"}
            discount={discount}
            setDiscount={setDiscount}
          />
          <Input
            columnName={"運費："}
            name={"shipment"}
            value={discount.shipment}
            placeholder={"請輸入運費"}
            discount={discount}
            setDiscount={setDiscount}
          />
          <Input
            columnName={"運費 price："}
            name={"price"}
            value={discount.price}
            placeholder={"請輸入 price"}
            discount={discount}
            setDiscount={setDiscount}
          />
          <Bottom>
            <Submit>提交</Submit>
          </Bottom>
        </form>
      </Wrapper>
    </div>
  );
};

export default UpdateDiscountPage;
