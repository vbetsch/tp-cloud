import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { logOut } from '../queries/api/auth';
import { AuthActionEnum } from '../reducers/AuthReducer';
import { removeRememberInLocalStorage } from '../services/localstorage';
import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import LoadingButton from '@mui/lab/LoadingButton';

// const Search = styled('div')(({ theme }) => ({
// 	position: 'relative',
// 	borderRadius: theme.shape.borderRadius,
// 	backgroundColor: alpha(theme.palette.common.white, 0.15),
// 	'&:hover': {
// 		backgroundColor: alpha(theme.palette.common.white, 0.25),
// 	},
// 	marginRight: theme.spacing(2),
// 	marginLeft: 0,
// 	width: '100%',
// 	[theme.breakpoints.up('sm')]: {
// 		marginLeft: theme.spacing(3),
// 		width: 'auto',
// 	},
// }));
//
// const SearchIconWrapper = styled('div')(({ theme }) => ({
// 	padding: theme.spacing(0, 2),
// 	height: '100%',
// 	position: 'absolute',
// 	pointerEvents: 'none',
// 	display: 'flex',
// 	alignItems: 'center',
// 	justifyContent: 'center',
// }));
//
// const StyledInputBase = styled(InputBase)(({ theme }) => ({
// 	color: 'inherit',
// 	'& .MuiInputBase-input': {
// 		padding: theme.spacing(1, 1, 1, 0),
// 		// vertical padding + font size from searchIcon
// 		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
// 		transition: theme.transitions.create('width'),
// 		width: '100%',
// 		[theme.breakpoints.up('md')]: {
// 			width: '20ch',
// 		},
// 	},
// }));

export default function Navbar() {
	const { state, dispatch } = useAuth();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const navigateToProfile = () => {
		router.push('/auth/profile');
		handleMenuClose();
	};

	const clickOnLogOut = async () => {
		setLoading(true);
		try {
			await logOut();
		} catch (e) {
			console.error(e);
			return;
		} finally {
			dispatch({
				type: AuthActionEnum.LOGOUT,
				payload: undefined,
			});
			handleMenuClose();
			setLoading(false);
		}

		if (state?.remember) {
			setLoading(true);
			try {
				dispatch({
					type: AuthActionEnum.SET_REMEMBER,
					payload: null,
				});
				await removeRememberInLocalStorage();
			} catch (e) {
				console.error(e);
				return;
			} finally {
				setLoading(false);
			}
		}

		setLoading(true);
		try {
			console.warn('You must be logged in to access this page. You will be redirected...');
			await router.push('/auth/sign-in');
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={navigateToProfile}>Profile</MenuItem>
			<MenuItem onClick={clickOnLogOut}>Logout</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Link href={'/'} style={{ textDecoration: 'none', color: 'white' }}>
						<Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
							TP Cloud
						</Typography>
					</Link>
					{/*<Search theme={theme}>*/}
					{/*	<SearchIconWrapper theme={theme}>*/}
					{/*		<SearchIcon />*/}
					{/*	</SearchIconWrapper>*/}
					{/*	<StyledInputBase theme={theme} placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />*/}
					{/*</Search>*/}
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
						<LoadingButton loading={loading}>
							{!loading && (
								<IconButton
									size="large"
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									sx={{ color: 'white' }}
								>
									<AccountCircle />
								</IconButton>
							)}
						</LoadingButton>
					</Box>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<LoadingButton loading={loading}>
							{!loading && (
								<IconButton
									size="large"
									aria-label="show more"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									sx={{ color: 'white' }}
								>
									<MenuIcon />
								</IconButton>
							)}
						</LoadingButton>
					</Box>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</Box>
	);
}
