import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import { isRouteMapBlock, RouteMap } from '../../router/routeMapParser';
import DashboardBlock from './DashboardBlock';

import 'Dashboard.scoped.scss';
import {
  LightButton,
  SolidButton,
} from '../../components/shared/Button/Button.styles';

export interface DashboardProps {
  className?: string;
  routeMap: RouteMap;
}

const Dashboard = (props: DashboardProps) => {
  const { className, routeMap } = props;

  function createData(
    name: string,
    platform: string,
    dLicences: number,
    mLicenses: number
  ) {
    return { name, platform, dLicences, mLicenses };
  }

  const rows = [
    createData('Acies Abogados', 'IvozProvider Irontec', 10, 8),
    createData('Ayuntamiento Bilbao', 'IvozProvider Irontec', 10, 8),
    createData('BicBerrilan', 'IvozProvider Irontec', 10, 8),
    createData('CaritasSoria', 'IvozProvider Irontec', 10, 8),
  ];

  return (
    <section>
      <div className='card welcome'>
        <div className='card-container'>
          <div>
            <h3>
              Welcome to <br /> Advanced Provisioning System
            </h3>
            <p>
              APS is an Open Source solution by Irontec. Add platforms, manage
              clients, assign license to VoIP users and much more.
            </p>
            <LightButton>Get started</LightButton>
          </div>

          <img src='assets/img/dashboard-welcome.svg' />
        </div>
      </div>
      <div className='card activity'>
        <div className='title'>Recent activity</div>

        <div className='content'>
          <div className='row'>
            <div className='time'>5m</div>
            <div className='value'>Login (Antonio)</div>
          </div>
          <div className='row'>
            <div className='time'>30m</div>
            <div className='value'>New admin added (Mikel)</div>
          </div>
          <div className='row'>
            <div className='time'>6h</div>
            <div className='value'>Login (Mikel)</div>
          </div>
          <div className='row'>
            <div className='time'>1d</div>
            <div className='value'>10 new licenses assigned (Carlos)</div>
          </div>
          <div className='row'>
            <div className='time'>1d</div>
            <div className='value'>New client added (Carlos)</div>
          </div>
        </div>
      </div>

      <div className='card amount'>
        <div className='img-container'>
          <img src='assets/img/dashboard-platforms.svg' />
        </div>

        <div className='number'>5</div>

        <div className='name'>Platforms</div>

        <div className='progress'>
          <span>+ 0</span>
          <img src='assets/img/same.svg' />
        </div>

        <a href='' className='link'>
          Go to platforms
        </a>
      </div>

      <div className='card amount'>
        <div className='img-container'>
          <img src='assets/img/dashboard-clients.svg' />
        </div>

        <div className='number'>120</div>

        <div className='name'>Clients</div>

        <div className='progress'>
          <span>+ 3</span>
          <img src='assets/img/up.svg' />
        </div>

        <a href='' className='link'>
          Go to clients
        </a>
      </div>

      <div className='card amount'>
        <div className='img-container'>
          <img src='assets/img/dashboard-platforms.svg' />
        </div>

        <div className='number'>1264</div>

        <div className='name'>Users</div>

        <div className='progress'>
          <span>- 15</span>
          <img src='assets/img/down.svg' />
        </div>

        <a href='' className='link'>
          Go to users
        </a>
      </div>

      <div className='card licenses'>
        <div className='title'>Licenses</div>

        <div className='radial'>
          <div className='circle'></div>
          <div className='data'>
            <div className='total'>Total</div>
            <div className='number'>1632</div>
          </div>
        </div>

        <div className='legend'>
          <div className='label'>
            <div className='color orange'></div>
            <div className='text'>Desktop</div>
          </div>

          <div className='label'>
            <div className='color red'></div>
            <div className='text'>Mobile</div>
          </div>
        </div>
      </div>
      <div className='card last'>
        <div className='header'>
          <div className='title'>Last added clients</div>
          <SolidButton>+ Add</SolidButton>
        </div>

        <div className='table'>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow style={{ fontSize: '13px' }}>
                  <TableCell
                    style={{ fontSize: '13px', color: 'var(--color-text)' }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{ fontSize: '13px', color: 'var(--color-text)' }}
                  >
                    Platform
                  </TableCell>
                  <TableCell
                    style={{ fontSize: '13px', color: 'var(--color-text)' }}
                  >
                    Desktop licenses
                  </TableCell>
                  <TableCell
                    style={{ fontSize: '13px', color: 'var(--color-text)' }}
                  >
                    Mobile licenses
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.name}
                    </TableCell>
                    <TableCell>{row.platform}</TableCell>
                    <TableCell>{row.dLicences}</TableCell>
                    <TableCell>{row.mLicenses}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </section>
  );
};

export default styled(Dashboard)(({ theme }) => {
  return {
    [theme.breakpoints.down('md')]: {
      '& ul': {
        paddingInlineStart: '20px',
      },
      '& ul li.submenu li': {
        paddingInlineStart: '40px',
      },
    },
  };
});
