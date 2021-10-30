import { useState, useEffect, useCallback, useContext } from "react";
import styled from "styled-components";
import cash from "../../../components/img/icon/cash.svg";
import card from "../../../components/img/icon/card.svg";
import PayWarnningContent from "./PayWarnningContent";
import { getUser, createOrder } from "../../../WEBAPI";
import { AuthContexts } from "../../../context";
const Form = styled.form`
  margin-top: 20px;
`;
const FormItemWrapper = styled.div`
  margin-top: 20px;
  padding-bottom: 22px;
  border-bottom: 2px solid #d7dadc;
  ${(props) =>
    props.$isInlineFormItem &&
    `
    padding: 20px;
    background: #F0F1F3;
    border-bottom:0;
  `}
`;

const SubTitle = styled.div`
  margin-top: 16px;
  color: #818b92;
`;
const FormContent = styled.div`
  margin-top: 12px;
`;
const FormRadioLabel = styled.label`
  display: inline-block;
  border: 1px solid #9ca4aa;
  padding: 6px 12px;
  color: #000;
  & + & {
    margin-left: 20px;
  }
  @media screen and (max-width: 698px) {
    & + & {
      margin-top: 20px;
      margin-left: 0px;
    }
    min-width: 100%;
  }
`;
const Span = styled.span`
  margin-left: 12px;
  & + & {
    margin-left: 20px;
  }
  & img {
    width: 25px;
    height: 25px;
    vertical-align: bottom;
  }
`;
const Input = styled.input`
  width: 100%;
  border: 1px solid #d7dadc;
  margin: 0;
  padding: 6px 12px;
`;
const FormNote = styled.div`
  background: #c4c4c4;
  font-size: 16px;
  padding: 6px 12px;
  color: #115460;
`;
const AdviceText = styled.p`
  color: #115460;
  font-size: 16px;
`;
const FormInputLabel = styled.label`
  margin: 10px 0;
  display: block;
  color: #818b92;
`;
const ForCheckboxItem = styled.div`
  @media screen and (max-width: 698px) {
    margin-top: 12px;
  }
`;
const InlineInput = styled.input`
  border: none;
  margin-left: 16px;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  font-style: italic;
  padding: 0 6px;
`;

const FormBtn = styled.button`
  margin-top: 20px;
  border: none;
  background: #f9897a;
  width: 100%;
  font-size: 18px;
  color: #fff;
  padding: 12px 0;
`;

const RenderShippingForm = ({ data }) => {
  const { user } = useContext(AuthContexts);
  const [isSameConsignee, setIsSameConsignee] = useState(true);
  const [isDonateInvoice, setIsDonateInvoice] = useState("withPackage");
  const [dbIsDonateInvoice, setDbIsDonateInvoice] = useState(true);
  const [payment, setPayment] = useState("card");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState(""); // 收件人同購買者
  const [errorName, setErrorName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [date, setDate] = useState(""); // 資料型別 string
  const [dbDate, setDbDate] = useState(); // 資料型別 date
  const [errorDate, setErrorDate] = useState();
  const [transactionNumber, setTransactionNumber] = useState("");
  const [errorLastFiveNumber, setErrorLastFiveNumber] = useState("");
  const [invoice, setInvoice] = useState("normal");
  const [companyInvoice, setCompanyInvoice] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  // useCallback
  console.log(errorAddress);
  const handlePayment = (e) => {
    setPayment(e.target.value);
  };
  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrorName("");
  };
  const handleReceiverName = (e) => {
    setReceiverName(e.target.value);
  };
  const handleReceiverPhone = (e) => {
    setReceiverPhone(e.target.value);
    setErrorPhone("");
  };
  const handleReceiverAddress = (e) => {
    setReceiverAddress(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrorAddress("");
  };
  const handleTransactionNumber = (e) => {
    setTransactionNumber(e.target.value);
    setErrorLastFiveNumber("");
  };
  const handleDate = (e) => {
    setDate(e.target.value);
    let time = new Date(e.target.value);
    setDbDate(time);
    setErrorDate("");
  };
  const handleInvoice = (e) => {
    setInvoice(e.target.value);
  };
  const handleCompanyInvoice = (e) => {
    setCompanyInvoice(e.target.value);
  };
  const handleDonateInvoice = (e) => {
    setIsDonateInvoice(e.target.value);
    if (e.target.value === "withPackage") setDbIsDonateInvoice(true);
    if (e.target.value === "donate") setDbIsDonateInvoice(false);
  };
  const handleSubmit = useCallback(
    (e) => {
      let prods = data;
      e.preventDefault();
      let order = {
        userId: user.id,
        buyerName: name,
        buyerPhone: phone,
        buyerAddress: address,
        deliverDate: dbDate,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverAddress: receiverAddress,
        lastFiveNumber: transactionNumber,
        donateInvoice: dbIsDonateInvoice,
        invoiceType: invoice,
        invoiceNumber: companyInvoice,
      };

      console.log("isSameConsignee", isSameConsignee);
      let products = prods.map((prod) => {
        return {
          id: prod["Product.id"],
          number: prod.product_quantity,
        };
      });
      console.log("order", order);
      console.log("products", products);
      if (products.length === 0) {
        alert("購物車還沒有商品");
        return;
      }
      if (!order.userId) {
        alert("請登入再進行購買");
        return;
      }
      // 配送日期繳款後五碼未填
      if (!order.deliverDate) {
        setErrorDate("*尚未選定配送時間");
      }
      if (order.deliverDate < new Date()) {
        setErrorDate("*配送時間不得為過去");
      }
      if (!order.lastFiveNumber) {
        setErrorLastFiveNumber("*尚未輸入信用卡或轉帳帳號的後五碼");
      }
      if (order.lastFiveNumber !== /^[0-9]{5}$/) {
        setErrorLastFiveNumber("*資料格式須為五碼數字");
      }
      // 收件人同購買人
      if (isSameConsignee) {
        if (!order.buyerName) {
          setErrorName("*尚未填寫姓名");
        }
        if (!order.buyerPhone) {
          setErrorPhone(" *尚未填寫手機號碼");
        }
        if (order.buyerPhone !== /^09[0-9]{8}$/) {
          setErrorPhone(" *手機格式不符");
        }
        if (!order.buyerAddress) {
          setErrorAddress(" *尚未填寫配送地址");
        }
      }
      // createOrder(products, order)
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((err) => {
      //     alert("系統處理異常，非常抱歉。請致電肥貓甜點將盡快為您服務!");
      //   });
    },
    [
      data,
      user.id,
      name,
      phone,
      address,
      companyInvoice,
      dbDate,
      receiverName,
      receiverPhone,
      receiverAddress,
      transactionNumber,
      dbIsDonateInvoice,
      invoice,
      isSameConsignee,
    ]
  );

  useEffect(() => {
    getUser().then((response) => {
      console.log(response);
      setName(`${response.user.firstname + response.user.lastname}`);
      setPhone(response.user.phone);
      setAddress(response.user.address);
    });
  }, []);

  return (
    <Form>
      <FormItemWrapper>
        <SubTitle>合作物流</SubTitle>
        <FormContent>
          <FormRadioLabel>
            <Span>黑貓宅配</Span>
          </FormRadioLabel>
        </FormContent>
      </FormItemWrapper>
      <FormItemWrapper>
        <SubTitle>付款方式</SubTitle>
        <FormContent>
          <FormRadioLabel>
            <input
              type="radio"
              name="payMethod"
              value="card"
              checked={payment === "card"}
              onChange={handlePayment}
            />
            <Span>
              <img src={card} alt="credit card" />
            </Span>
            <Span>信用卡</Span>
          </FormRadioLabel>
          <FormRadioLabel>
            <input
              type="radio"
              name="payMethod"
              value="ATM"
              checked={payment === "ATM"}
              onChange={handlePayment}
            />
            <Span>
              <img src={cash} alt="cash" />
            </Span>
            <Span>ATM</Span>
          </FormRadioLabel>
        </FormContent>
        <SubTitle>備註</SubTitle>
        <FormContent>
          <Input
            type="text"
            name="shipping_note"
            value={notes}
            onChange={handleNoteChange}
          />
        </FormContent>
        <SubTitle>結帳須知</SubTitle>
        <FormContent>
          <FormNote>
            <PayWarnningContent />
          </FormNote>
        </FormContent>
      </FormItemWrapper>
      <FormItemWrapper>
        <SubTitle>購買人資訊</SubTitle>
        <FormContent>
          <FormInputLabel htmlFor="fullname">
            姓名<span style={{ color: "red" }}>{errorName}</span>
          </FormInputLabel>

          <Input
            type="text"
            id="fullname"
            placeholder="請輸入姓名"
            value={name}
            onChange={handleNameChange}
          />
        </FormContent>
        <FormContent>
          <FormInputLabel htmlFor="phone">
            手機<span style={{ color: "red" }}> {errorPhone}</span>
          </FormInputLabel>
          <Input
            type="text"
            id="phone"
            placeholder="請輸入手機號碼"
            value={phone}
            onChange={handlePhoneChange}
          />
          <AdviceText>
            *取貨通知將以此電話聯繫，請勿加入任何空格或符號，使用超商取貨請務必填寫10碼手機，如：0987654321
          </AdviceText>
        </FormContent>
        <FormContent>
          <FormInputLabel htmlFor="address">
            配送地址<span style={{ color: "red" }}>{errorAddress}</span>
          </FormInputLabel>
          <Input
            type="text"
            id="address"
            placeholder="請填寫配送地址"
            value={address}
            onChange={handleAddress}
          />
        </FormContent>
        <FormContent>
          <FormInputLabel htmlFor="shippingDate">
            配送日期<span style={{ color: "red" }}>{errorDate}</span>
          </FormInputLabel>
          <Input
            type="date"
            id="shippingDate"
            value={date}
            onChange={handleDate}
          />
        </FormContent>
        <FormContent>
          <FormInputLabel htmlFor="last5Number">
            帳號/信用卡 後五碼
            <span style={{ color: "red" }}>{errorLastFiveNumber}</span>
          </FormInputLabel>
          <Input
            type="number"
            id="last5Number"
            placeholder="請輸入信用卡或轉帳帳號的後五碼"
            value={transactionNumber}
            onChange={handleTransactionNumber}
          />
        </FormContent>
      </FormItemWrapper>
      <FormItemWrapper>
        <SubTitle>隨貨附發票?</SubTitle>
        <FormContent>
          <FormRadioLabel>
            <input
              type="radio"
              name="invoice"
              value="withPackage"
              checked={isDonateInvoice === "withPackage"}
              onChange={handleDonateInvoice}
            />
            <Span>是</Span>
          </FormRadioLabel>
          <FormRadioLabel>
            <input
              type="radio"
              name="invoice"
              value="donate"
              checked={isDonateInvoice === "donate"}
              onChange={handleDonateInvoice}
            />
            <Span>捐贈</Span>
          </FormRadioLabel>
        </FormContent>
        <SubTitle>發票類型</SubTitle>
        <FormContent>
          <FormRadioLabel>
            <input
              type="radio"
              name="inVoiceType"
              value="normal"
              checked={invoice === "normal"}
              onChange={handleInvoice}
            />
            <Span>二聯式</Span>
          </FormRadioLabel>
          <FormRadioLabel>
            <input
              type="radio"
              name="inVoiceType"
              value="withCompanyNum"
              checked={invoice === "withCompanyNum"}
              onChange={handleInvoice}
            />
            <Span>開立統編</Span>
            {invoice === "withCompanyNum" && (
              <InlineInput
                type="text"
                name="companuNum"
                placeholder="請輸入統編"
                value={companyInvoice}
                onChange={handleCompanyInvoice}
              />
            )}
          </FormRadioLabel>
          <SubTitle>發票須知</SubTitle>
          <FormContent>
            <FormNote>
              <h3>依統一發票使用辦法規定</h3>
              <p>
                依統一發票使用辦法規定：個人(二聯式)發票一經開立，無法更改或改開公司戶(三聯式)發票。請務必確認選用之電子發票載具代碼是否正確，一經開立不得要求更改。
              </p>
            </FormNote>
          </FormContent>
        </FormContent>
      </FormItemWrapper>
      <FormItemWrapper>
        <SubTitle>收件人資訊</SubTitle>
        <FormContent>
          <FormRadioLabel>
            <input
              type="radio"
              name="consignee"
              value={isSameConsignee}
              checked={isSameConsignee}
              onChange={(e) => setIsSameConsignee(!isSameConsignee)}
            />
            <Span>同購買人</Span>
          </FormRadioLabel>
          <FormRadioLabel>
            <input
              type="radio"
              name="consignee"
              value={!isSameConsignee}
              checked={!isSameConsignee}
              onChange={(e) => setIsSameConsignee(!isSameConsignee)}
            />
            <Span>收件與購買不同人</Span>
          </FormRadioLabel>
          {!isSameConsignee && (
            <FormItemWrapper $isInlineFormItem={true}>
              <FormContent>
                <FormInputLabel htmlFor="consignee">
                  收件人姓名
                  <span style={{ color: "red" }}>*尚未輸入收件人姓名</span>
                </FormInputLabel>
                <Input
                  type="text"
                  id="consignee"
                  value={receiverName}
                  onChange={handleReceiverName}
                />
              </FormContent>
              <FormContent>
                <FormInputLabel htmlFor="consigneePhone">
                  手機
                  <span style={{ color: "red" }}>*尚未輸入收件人手機號碼</span>
                </FormInputLabel>
                <Input
                  type="text"
                  id="consigneePhone"
                  value={receiverPhone}
                  onChange={handleReceiverPhone}
                />
                <AdviceText>
                  *取貨通知將以此電話聯繫，請勿加入任何空格或符號，使用超商取貨請務必填寫10碼手機，如：0987654321
                </AdviceText>
              </FormContent>
              <FormContent>
                <FormInputLabel htmlFor="consigneeAddress">
                  配送地址
                  <span style={{ color: "red" }}>*尚未填寫配送地址</span>
                </FormInputLabel>
                <Input
                  type="text"
                  id="consigneeAddress"
                  value={receiverAddress}
                  onChange={handleReceiverAddress}
                />
              </FormContent>
            </FormItemWrapper>
          )}
          <SubTitle>收件人資訊預覽</SubTitle>
          <FormContent>
            <FormNote>
              <div>
                收件人:
                {isSameConsignee && <span>{name}</span>}
                {!isSameConsignee && <span>{receiverName}</span>}
              </div>
              <div>
                聯絡電話:
                {isSameConsignee && <span>{phone}</span>}
                {!isSameConsignee && <span>{receiverPhone}</span>}
              </div>
              <div>
                收件地址:
                {isSameConsignee && <span>{address}</span>}
                {!isSameConsignee && <span>{receiverAddress}</span>}
              </div>
            </FormNote>
          </FormContent>
        </FormContent>
      </FormItemWrapper>
      <FormItemWrapper>
        <FormContent>
          <ForCheckboxItem>
            <input type="checkbox" name="dataPolicy" />
            <Span>同意會員責任規範及個資聲明與商家會員條款</Span>
          </ForCheckboxItem>
          <ForCheckboxItem>
            <input type="checkbox" name="orderPolicy" />
            <Span>
              為保障彼此之權益，賣家在收到您的訂單後仍保有決定是否接受訂單及出貨與否之權利
            </Span>
          </ForCheckboxItem>
        </FormContent>
      </FormItemWrapper>
      <FormBtn type="submit" onClick={handleSubmit}>
        立即結帳
      </FormBtn>
    </Form>
  );
};
export default RenderShippingForm;
