import Title from '../components/Title';
import Navbar from '../components/Navbar';
import React, { ReactElement } from 'react';

export interface NavbarPageProperties {
	children: ReactElement;
	title?: string;
}

export default function NavbarPage(props: NavbarPageProperties) {
	return (
		<>
			<Title title={props.title} />
			<Navbar />
			{props.children}
		</>
	);
}
