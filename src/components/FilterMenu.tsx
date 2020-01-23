import * as React from 'react';

// Material UI
import {
  IconButton,
  Menu,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Tooltip,
} from '@material-ui/core';

import {
  FilterList,
} from '@material-ui/icons';

interface IProps {
  initGameModeValue: string;
  initSeasonValue: string;
  filterGameModeValue: (value: string) => void;
  filterSeasonValue: (value: string) => void;
}

const FilterMenu = ({
  initGameModeValue,
  initSeasonValue,
  filterGameModeValue,
  filterSeasonValue
}: IProps) => {

  // メニュー
  const [filterMenuState, setFilterMenuState] = React.useState<null | HTMLElement>(null);
  const filterMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuState(event.currentTarget);
  };
  const filterMenuClose = () => {
    setFilterMenuState(null);
  };

  // フィルターアクション
  const filterGameModeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    filterGameModeValue(newValue);
    filterMenuClose();
  }
  const filterSeasonChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    filterSeasonValue(newValue);
    filterMenuClose();
  }

  return(
    <React.Fragment>
      <Tooltip title="フィルター">
        <IconButton aria-controls="Filter datas" aria-haspopup="true" onClick={filterMenuClick}>
          <FilterList />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={filterMenuState}
        keepMounted
        open={Boolean(filterMenuState)}
        onClose={filterMenuClose}
      >
        <RadioGroup aria-label="Game mode filter" name="filterGameModeGroup" value={initGameModeValue} onChange={filterGameModeChangeHandler} 
        style={{padding: "10px 15px"}}>
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="All"
          />
          <FormControlLabel
            value="solo-fpp"
            control={<Radio />}
            label="Solo FPP"
          />
          <FormControlLabel
            value="squad-fpp"
            control={<Radio />}
            label="Squad FPP"
          />
        </RadioGroup>
        <Divider variant="middle" />
        {/* シーズン手動追加 */}
        <RadioGroup aria-label="Season filter" name="filterSeasonGroup" value={initSeasonValue} onChange={filterSeasonChangeHandler}
        style={{padding: "10px 15px"}}>
          <FormControlLabel
            value="current-season"
            control={<Radio />}
            label="Season 6"
          />
          <FormControlLabel
            value="season-5"
            control={<Radio />}
            label="Season 5"
          />
          <FormControlLabel
            value="season-4"
            control={<Radio />}
            label="Season 4"
          />
        </RadioGroup>
      </Menu>
    </React.Fragment>
  )
}

export default FilterMenu