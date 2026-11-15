import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openOrderWindow: () => {},
  closeOrderWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenOrderWindow = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderWindow = () => {
    setSelectedOrder(null);
  };

  return (
    <GeneralContext.Provider
      value={{
        openOrderWindow: handleOpenOrderWindow,
        closeOrderWindow: handleCloseOrderWindow,
      }}
    >
      {props.children}
      {selectedOrder && (
        <BuyActionWindow
          name={selectedOrder.name}
          price={selectedOrder.price}
          mode={selectedOrder.mode}
          onClose={handleCloseOrderWindow}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
