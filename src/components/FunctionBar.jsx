import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const FunctionBar = ({ searchStr, setSearchStr, ascSort, setAscSort }) => {
  return (
    <div className="function-bar ">
      <input
        type="text"
        placeholder="Search the Meal"
        className="search-bar"
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
      />

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="sort-tooltip">Sort the Meals on the Tiltle</Tooltip>
        }
      >
        <button className="func-button" onClick={() => setAscSort(!ascSort)}>
          {ascSort ? "Z-A" : "A-Z"}
        </button>
      </OverlayTrigger>
    </div>
  );
};

export default FunctionBar;
