export const PassResetOtp = (otp: string) => {
  return `<!DOCTYPE html>
<html
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office"
>
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<!--[if !mso]><!-- -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<!--<![endif]-->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta
			name="format-detection"
			content="telephone=no, date=no, address=no, email=no"
		/>
		<meta name="x-apple-disable-message-reformatting" />
		<link
			href="https://fonts.googleapis.com/css?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,800"
			rel="stylesheet"
		/>
		<title>Trakg-Password Reset Email</title>
		<!-- Made with Postcards Email Builder by Designmodo -->
		<style>
			html,
			body {
				margin: 0 !important;
				padding: 0 !important;
				min-height: 100% !important;
				width: 100% !important;
				-webkit-font-smoothing: antialiased;
			}
			* {
				-ms-text-size-adjust: 100%;
			}
			#outlook a {
				padding: 0;
			}
			.ReadMsgBody,
			.ExternalClass {
				width: 100%;
			}
			.ExternalClass,
			.ExternalClass p,
			.ExternalClass td,
			.ExternalClass div,
			.ExternalClass span,
			.ExternalClass font {
				line-height: 100%;
			}
			table,
			td,
			th {
				mso-table-lspace: 0 !important;
				mso-table-rspace: 0 !important;
				border-collapse: collapse;
			}
			u + .body table,
			u + .body td,
			u + .body th {
				will-change: transform;
			}
			body,
			td,
			th,
			p,
			div,
			li,
			a,
			span {
				-webkit-text-size-adjust: 100%;
				-ms-text-size-adjust: 100%;
				mso-line-height-rule: exactly;
			}
			img {
				border: 0;
				outline: 0;
				line-height: 100%;
				text-decoration: none;
				-ms-interpolation-mode: bicubic;
			}
			a[x-apple-data-detectors] {
				color: inherit !important;
				text-decoration: none !important;
			}
			.body .pc-project-body {
				background-color: transparent !important;
			}

			@media (min-width: 621px) {
				.pc-lg-hide {
					display: none;
				}
				.pc-lg-bg-img-hide {
					background-image: none !important;
				}
			}

			@media (max-width: 620px) {
				.pc-project-body {
					min-width: 0px !important;
				}
				.pc-project-container {
					width: 100% !important;
				}
				.pc-sm-hide,
				.pc-w620-gridCollapsed-1 > tbody > tr > .pc-sm-hide {
					display: none !important;
				}
				.pc-sm-bg-img-hide {
					background-image: none !important;
				}
				.pc-w620-padding-0-0-0-0 {
					padding: 0px 0px 0px 0px !important;
				}
				table.pc-w620-spacing-0-0-30-0 {
					margin: 0px 0px 30px 0px !important;
				}
				td.pc-w620-spacing-0-0-30-0,
				th.pc-w620-spacing-0-0-30-0 {
					margin: 0 !important;
					padding: 0px 0px 30px 0px !important;
				}
				.pc-w620-padding-32-20-0-20 {
					padding: 32px 20px 0px 20px !important;
				}
				.pc-w620-itemsSpacings-0-20 {
					padding-left: 0px !important;
					padding-right: 0px !important;
					padding-top: 10px !important;
					padding-bottom: 10px !important;
				}
				.pc-w620-valign-top {
					vertical-align: top !important;
				}
				td.pc-w620-halign-center,
				th.pc-w620-halign-center {
					text-align: center !important;
				}
				table.pc-w620-halign-center {
					float: none !important;
					margin-right: auto !important;
					margin-left: auto !important;
				}
				img.pc-w620-halign-center {
					margin-right: auto !important;
					margin-left: auto !important;
				}
				div.pc-w620-textAlign-center,
				th.pc-w620-textAlign-center,
				a.pc-w620-textAlign-center,
				td.pc-w620-textAlign-center {
					text-align: center !important;
					text-align-last: center !important;
				}
				table.pc-w620-textAlign-center {
					float: none !important;
					margin-right: auto !important;
					margin-left: auto !important;
				}
				img.pc-w620-textAlign-center {
					margin-right: auto !important;
					margin-left: auto !important;
				}
				.pc-w620-lineHeight-100pc {
					line-height: 100% !important;
				}
				.pc-w620-fontSize-40px {
					font-size: 40px !important;
				}
				div.pc-w620-align-center,
				th.pc-w620-align-center,
				a.pc-w620-align-center,
				td.pc-w620-align-center {
					text-align: center !important;
					text-align-last: center !important;
				}
				table.pc-w620-align-center {
					float: none !important;
					margin-right: auto !important;
					margin-left: auto !important;
				}
				img.pc-w620-align-center {
					margin-right: auto !important;
					margin-left: auto !important;
				}
				.pc-w620-width-84pc {
					width: 84% !important;
				}
				.pc-w620-height-100pc {
					height: 100% !important;
				}
				.pc-w620-padding-40-20-40-20 {
					padding: 40px 20px 40px 20px !important;
				}
				.pc-w620-font-size-18px {
					font-size: 18px !important;
				}
				.pc-w620-line-height-26px {
					line-height: 26px !important;
				}
				.pc-w620-itemsSpacings-0-30 {
					padding-left: 0px !important;
					padding-right: 0px !important;
					padding-top: 15px !important;
					padding-bottom: 15px !important;
				}
				table.pc-w620-spacing-0-0-20-0 {
					margin: 0px 0px 20px 0px !important;
				}
				td.pc-w620-spacing-0-0-20-0,
				th.pc-w620-spacing-0-0-20-0 {
					margin: 0 !important;
					padding: 0px 0px 20px 0px !important;
				}
				.pc-w620-padding-18-20-18-20 {
					padding: 18px 20px 18px 20px !important;
				}
				.pc-w620-fontSize-32px {
					font-size: 32px !important;
				}
				.pc-w620-padding-36-16-16-16 {
					padding: 36px 16px 16px 16px !important;
				}
				table.pc-w620-spacing-0-0-0-0 {
					margin: 0px 0px 0px 0px !important;
				}
				td.pc-w620-spacing-0-0-0-0,
				th.pc-w620-spacing-0-0-0-0 {
					margin: 0 !important;
					padding: 0px 0px 0px 0px !important;
				}
				.pc-w620-padding-16-16-16-16 {
					padding: 16px 16px 16px 16px !important;
				}

				.pc-w620-gridCollapsed-1 > tbody,
				.pc-w620-gridCollapsed-1 > tbody > tr,
				.pc-w620-gridCollapsed-1 > tr {
					display: inline-block !important;
				}
				.pc-w620-gridCollapsed-1.pc-width-fill > tbody,
				.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,
				.pc-w620-gridCollapsed-1.pc-width-fill > tr {
					width: 100% !important;
				}
				.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,
				.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,
				.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {
					width: 100% !important;
				}
				.pc-w620-gridCollapsed-1 > tbody > tr > td,
				.pc-w620-gridCollapsed-1 > tr > td {
					display: block !important;
					width: auto !important;
					padding-left: 0 !important;
					padding-right: 0 !important;
					margin-left: 0 !important;
				}
				.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,
				.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {
					width: 100% !important;
				}
				.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,
				.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {
					width: 100% !important;
				}
				.pc-w620-gridCollapsed-1
					> tbody
					> .pc-grid-tr-first
					> .pc-grid-td-first,
				.pc-w620-gridCollapsed-1
					> .pc-grid-tr-first
					> .pc-grid-td-first {
					padding-top: 0 !important;
				}
				.pc-w620-gridCollapsed-1
					> tbody
					> .pc-grid-tr-last
					> .pc-grid-td-last,
				.pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {
					padding-bottom: 0 !important;
				}

				.pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,
				.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {
					padding-top: 0 !important;
				}
				.pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,
				.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {
					padding-bottom: 0 !important;
				}
				.pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,
				.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {
					padding-left: 0 !important;
				}
				.pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,
				.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {
					padding-right: 0 !important;
				}

				.pc-w620-tableCollapsed-1 > tbody,
				.pc-w620-tableCollapsed-1 > tbody > tr,
				.pc-w620-tableCollapsed-1 > tr {
					display: block !important;
				}
				.pc-w620-tableCollapsed-1.pc-width-fill > tbody,
				.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,
				.pc-w620-tableCollapsed-1.pc-width-fill > tr {
					width: 100% !important;
				}
				.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,
				.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,
				.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {
					width: 100% !important;
				}
				.pc-w620-tableCollapsed-1 > tbody > tr > td,
				.pc-w620-tableCollapsed-1 > tr > td {
					display: block !important;
					width: auto !important;
				}
				.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,
				.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {
					width: 100% !important;
					box-sizing: border-box !important;
				}
				.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,
				.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {
					width: 100% !important;
					box-sizing: border-box !important;
				}
			}

			@font-face {
				font-family: "DM Sans";
				font-style: normal;
				font-weight: 800;
				src: url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAIptRR23w.woff")
						format("woff"),
					url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAIptRR232.woff2")
						format("woff2");
			}
			@font-face {
				font-family: "DM Sans";
				font-style: normal;
				font-weight: 400;
				src: url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR23w.woff")
						format("woff"),
					url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR232.woff2")
						format("woff2");
			}
			@font-face {
				font-family: "DM Sans";
				font-style: normal;
				font-weight: 500;
				src: url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxRR23w.woff")
						format("woff"),
					url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxRR232.woff2")
						format("woff2");
			}
			@font-face {
				font-family: "DM Sans";
				font-style: normal;
				font-weight: 700;
				src: url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZtRR23w.woff")
						format("woff"),
					url("https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZtRR232.woff2")
						format("woff2");
			}

			.social-icons {
				background: transparent;
				display: flex;
				justify-content: center;
				padding: 10px;
			}
			.social-strip {
				display: flex;
				gap: 15px;
			}

			.social-btn {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				background-color: #27283d;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				transition: transform 0.3s ease, background-color 0.3s ease;
				cursor: pointer;
			}

			.social-btn:hover {
				transform: scale(1.2);
				background-color: #0a0f4f;
				box-shadow: 0 4px 10px #030852;
			}

			.social-btn img {
				width: 30px;
				height: 30px;
			}
		</style>
		<!--[if mso]>
			<style type="text/css">
				.pc-font-alt {
					font-family: Arial, Helvetica, sans-serif !important;
				}
			</style>
		<![endif]-->
		<!--[if gte mso 9]>
			<xml>
				<o:OfficeDocumentSettings>
					<o:AllowPNG />
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		<![endif]-->
	</head>

	<body
		class="body pc-font-alt"
		style="
			width: 100% !important;
			min-height: 100% !important;
			margin: 0 !important;
			padding: 0 !important;
			font-weight: normal;
			color: #2d3a41;
			mso-line-height-rule: exactly;
			-webkit-font-smoothing: antialiased;
			-webkit-text-size-adjust: 100%;
			-ms-text-size-adjust: 100%;
			font-variant-ligatures: normal;
			text-rendering: optimizeLegibility;
			-moz-osx-font-smoothing: grayscale;
			background-color: #e8ecf0;
		"
		bgcolor="#e8ecf0"
	>
		<table
			class="pc-project-body"
			style="
				table-layout: fixed;
				width: 100%;
				min-width: 600px;
				background-color: #e8ecf0;
			"
			bgcolor="#e8ecf0"
			border="0"
			cellspacing="0"
			cellpadding="0"
			role="presentation"
		>
			<tr>
				<td align="center" valign="top" style="width: auto">
					<table
						class="pc-project-container"
						align="center"
						style="width: 600px; max-width: 600px"
						border="0"
						cellpadding="0"
						cellspacing="0"
						role="presentation"
					>
						<tr>
							<td
								class="pc-w620-padding-0-0-0-0"
								style="padding: 20px 0px 20px 0px"
								align="left"
								valign="top"
							>
								<table
									border="0"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
									width="100%"
								>
									<tr>
										<td valign="top">
											<!-- BEGIN MODULE: Header -->
											<table
												width="100%"
												border="0"
												cellspacing="0"
												cellpadding="0"
												role="presentation"
											>
												<tr>
													<td
														class="pc-w620-spacing-0-0-0-0"
														width="100%"
														border="0"
														cellspacing="0"
														cellpadding="0"
														role="presentation"
													>
														<table
															width="100%"
															border="0"
															cellspacing="0"
															cellpadding="0"
															role="presentation"
														>
															<tr>
																<!--[if !gte mso 9]><!-- -->
																<td
																	valign="top"
																	class="pc-w620-padding-36-16-16-16"
																	style="
																		background-image: url('https://res.cloudinary.com/dioiyots5/image/upload/v1751348819/991c6804456d2d94f7f1a92f4a4f58bc_vj1duj.webp');
																		background-size: cover;
																		background-position: center;
																		background-repeat: no-repeat;
																		padding: 40px
																			16px
																			0px
																			16px;
																		height: unset;
																		background-color: #f3f3f3;
																	"
																	bgcolor="#f3f3f3"
																	background="images/991c6804456d2d94f7f1a92f4a4f58bc.png"
																>
																	<!--<![endif]-->
																	<!--[if gte mso 9]>
                <td valign="top" align="center" style="background-image: url('images/991c6804456d2d94f7f1a92f4a4f58bc.png'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #f3f3f3; border-radius: 0px;" bgcolor="#f3f3f3" background="images/991c6804456d2d94f7f1a92f4a4f58bc.png">
            <![endif]-->
																	<!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
                    <v:fill src="images/991c6804456d2d94f7f1a92f4a4f58bc.png" color="#f3f3f3" type="frame" size="1,1" aspect="atleast" origin="0,0" position="0,0"/>
                    <v:textbox style="mso-fit-shape-to-text: true;" inset="0,0,0,0">
                        <div style="font-size: 0; line-height: 0;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="font-size: 14px; line-height: 1.5;" valign="top">
                                        <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tr>
                                                <td colspan="3" height="40" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td width="16" valign="top" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                                <td valign="top" align="left">
                <![endif]-->
																	<table
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr>
																			<td
																				class="pc-w620-spacing-0-0-30-0"
																				align="center"
																				valign="top"
																			>
																				<a
																					class="pc-font-alt"
																					href="trakg.com"
																					target="_blank"
																					style="
																						text-decoration: none;
																						display: inline-block;
																						vertical-align: top;
																					"
																				>
																					<img
																						src="https://res.cloudinary.com/dioiyots5/image/upload/v1751348819/trakg_image-827c43a3_pf8mvi.webp"
																						width="178"
																						height="81"
																						alt=""
																						style="
																							display: block;
																							outline: 0;
																							line-height: 100%;
																							-ms-interpolation-mode: bicubic;
																							height: 81px;
																							max-height: 100%;
																							width: auto;
																							border-radius: 100px
																								100px
																								100px
																								100px;
																							border: 0;
																						"
																					/>
																				</a>
																			</td>
																		</tr>
																	</table>
																	<table
																		class="pc-width-fill pc-w620-gridCollapsed-0"
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr
																			class="pc-grid-tr-first pc-grid-tr-last"
																		>
																			<td
																				class="pc-grid-td-first pc-grid-td-last"
																				align="center"
																				valign="top"
																				style="
																					padding-top: 0px;
																					padding-right: 0px;
																					padding-bottom: 0px;
																					padding-left: 0px;
																				"
																			>
																				<table
																					style="
																						border-collapse: separate;
																						border-spacing: 0;
																						width: 100%;
																					"
																					border="0"
																					cellpadding="0"
																					cellspacing="0"
																					role="presentation"
																				>
																					<tr>
																						<td
																							class="pc-w620-padding-32-20-0-20"
																							align="center"
																							valign="middle"
																							background="https://res.cloudinary.com/dioiyots5/image/upload/v1751348819/58267a62fd53648d24b159ac745ab531_c79cag.webp"
																							style="
																								padding: 10px
																									0px
																									0px
																									32px;
																								mso-padding-left-alt: 0;
																								margin-left: 32px;
																								height: auto;
																								background-image: url('https://res.cloudinary.com/dioiyots5/image/upload/v1751348819/58267a62fd53648d24b159ac745ab531_c79cag.webp');
																								background-size: cover;
																								background-position: 50%
																									0;
																								background-repeat: no-repeat;
																								background-color: #1b1b1b;
																								border-radius: 6px
																									6px
																									0px
																									0px;
																								border-top: 3px
																									solid
																									#417cd6;
																							"
																						>
																							<table
																								align="center"
																								width="100%"
																								border="0"
																								cellpadding="0"
																								cellspacing="0"
																								role="presentation"
																							>
																								<tr>
																									<td
																										align="center"
																										valign="top"
																									>
																										<table
																											width="100%"
																											border="0"
																											cellpadding="0"
																											cellspacing="0"
																											role="presentation"
																										>
																											<tr>
																												<td
																													class="pc-w620-valign-top pc-w620-halign-center"
																												>
																													<table
																														class="pc-width-fill pc-w620-gridCollapsed-1 pc-w620-halign-center"
																														width="100%"
																														border="0"
																														cellpadding="0"
																														cellspacing="0"
																														role="presentation"
																													>
																														<tr
																															class="pc-grid-tr-first pc-grid-tr-last"
																														>
																															<td
																																class="pc-grid-td-first pc-w620-itemsSpacings-0-20"
																																align="left"
																																valign="middle"
																																style="
																																	width: 50%;
																																	padding-top: 0px;
																																	padding-right: 0px;
																																	padding-bottom: 0px;
																																	padding-left: 0px;
																																"
																															>
																																<table
																																	class="pc-w620-halign-center"
																																	style="
																																		width: 100%;
																																	"
																																	border="0"
																																	cellpadding="0"
																																	cellspacing="0"
																																	role="presentation"
																																>
																																	<tr>
																																		<td
																																			class="pc-w620-padding-0-0-0-0 pc-w620-halign-center pc-w620-valign-top"
																																			align="left"
																																			valign="middle"
																																			style="
																																				padding: 0px
																																					0px
																																					20px
																																					0px;
																																				height: auto;
																																			"
																																		>
																																			<table
																																				class="pc-w620-halign-center"
																																				align="left"
																																				width="100%"
																																				border="0"
																																				cellpadding="0"
																																				cellspacing="0"
																																				role="presentation"
																																			>
																																				<tr>
																																					<td
																																						class="pc-w620-halign-center"
																																						align="left"
																																						valign="top"
																																					>
																																						<table
																																							border="0"
																																							cellpadding="0"
																																							cellspacing="0"
																																							role="presentation"
																																							class="pc-w620-halign-center"
																																							align="left"
																																						>
																																							<tr>
																																								<td
																																									valign="top"
																																									class="pc-w620-textAlign-center"
																																									align="left"
																																								>
																																									<div
																																										class="pc-font-alt pc-w620-textAlign-center pc-w620-fontSize-40px pc-w620-lineHeight-100pc"
																																										style="
																																											line-height: 50px;
																																											letter-spacing: -0.2px;
																																											font-family: 'DM Sans',
																																												Arial,
																																												Helvetica,
																																												sans-serif;
																																											font-size: 44px;
																																											font-weight: normal;
																																											color: #141414;
																																											text-align: left;
																																											text-align-last: left;
																																										"
																																									>
																																										<div>
																																											<span
																																												style="
																																													font-family: 'DM Sans',
																																														Arial,
																																														Helvetica,
																																														sans-serif;
																																													font-weight: 700;
																																													font-style: normal;
																																													color: #141414;
																																													letter-spacing: -0.5px;
																																												"
																																												>Verify
																																												your
																																												identity
																																												to
																																												reset
																																												password
																																											</span>
																																										</div>
																																									</div>
																																								</td>
																																							</tr>
																																						</table>
																																					</td>
																																				</tr>
																																			</table>
																																		</td>
																																	</tr>
																																</table>
																															</td>
																															<td
																																class="pc-grid-td-last pc-w620-itemsSpacings-0-20"
																																align="left"
																																valign="middle"
																																style="
																																	width: 50%;
																																	padding-top: 0px;
																																	padding-right: 0px;
																																	padding-bottom: 0px;
																																	padding-left: 0px;
																																	mso-padding-left-alt: 0;
																																	margin-left: 0px;
																																"
																															>
																																<table
																																	class="pc-w620-halign-center"
																																	style="
																																		width: 300px;
																																	"
																																	border="0"
																																	cellpadding="0"
																																	cellspacing="0"
																																	role="presentation"
																																>
																																	<tr>
																																		<td
																																			class="pc-w620-halign-center pc-w620-valign-top"
																																			align="left"
																																			valign="middle"
																																		>
																																			<table
																																				class="pc-w620-halign-center"
																																				align="left"
																																				width="100%"
																																				border="0"
																																				cellpadding="0"
																																				cellspacing="0"
																																				role="presentation"
																																			>
																																				<tr>
																																					<td
																																						class="pc-w620-halign-center"
																																						align="left"
																																						valign="top"
																																						style="
																																							line-height: 1;
																																						"
																																					>
																																						<table
																																							width="100%"
																																							border="0"
																																							cellpadding="0"
																																							cellspacing="0"
																																							role="presentation"
																																						>
																																							<tr>
																																								<td
																																									class="pc-w620-halign-center"
																																									align="left"
																																									valign="top"
																																								>
																																									<img
																																										src="https://res.cloudinary.com/dioiyots5/image/upload/v1751348819/image-1737475969934_g6gmtv.webp"
																																										class="pc-w620-width-84pc pc-w620-height-100pc pc-w620-align-center"
																																										width="300"
																																										height="100"
																																										alt=""
																																										style="
																																											display: block;
																																											outline: 0;
																																											line-height: 100%;
																																											-ms-interpolation-mode: bicubic;
																																											width: 100%;
																																											height: 100%;
																																											border: 0;
																																										"
																																									/>
																																								</td>
																																							</tr>
																																						</table>
																																					</td>
																																				</tr>
																																			</table>
																																		</td>
																																	</tr>
																																</table>
																															</td>
																														</tr>
																													</table>
																												</td>
																											</tr>
																										</table>
																									</td>
																								</tr>
																							</table>
																						</td>
																					</tr>
																				</table>
																			</td>
																		</tr>
																	</table>
																	<table
																		class="pc-width-fill pc-w620-gridCollapsed-0"
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr
																			class="pc-grid-tr-first pc-grid-tr-last"
																		>
																			<td
																				class="pc-grid-td-first"
																				align="center"
																				valign="top"
																				style="
																					padding-top: 0px;
																					padding-right: 0px;
																					padding-bottom: 0px;
																					padding-left: 0px;
																				"
																			>
																				<table
																					style="
																						border-collapse: separate;
																						border-spacing: 0;
																						width: 100%;
																					"
																					border="0"
																					cellpadding="0"
																					cellspacing="0"
																					role="presentation"
																				>
																					<tr>
																						<td
																							class="pc-w620-padding-40-20-40-20"
																							align="center"
																							valign="middle"
																							style="
																								padding: 32px
																									32px
																									40px
																									32px;
																								mso-padding-left-alt: 0;
																								margin-left: 32px;
																								height: auto;
																								background-color: #ffffff;
																								border-radius: 0px
																									0px
																									8px
																									8px;
																							"
																						>
																							<table
																								align="center"
																								width="100%"
																								border="0"
																								cellpadding="0"
																								cellspacing="0"
																								role="presentation"
																							>
																								<tr>
																									<td
																										align="center"
																										valign="top"
																									>
																										<table
																											width="100%"
																											align="center"
																											border="0"
																											cellpadding="0"
																											cellspacing="0"
																											role="presentation"
																										>
																											<tr>
																												<td
																													valign="top"
																													style="
																														padding: 0px
																															0px
																															20px
																															0px;
																														height: auto;
																													"
																												>
																													<table
																														border="0"
																														cellpadding="0"
																														cellspacing="0"
																														role="presentation"
																														width="100%"
																														align="left"
																													>
																														<tr>
																															<td
																																valign="top"
																																align="left"
																															>
																																<div
																																	class="pc-font-alt"
																																	style="
																																		text-decoration: none;
																																	"
																																>
																																	<div
																																		style="
																																			font-size: 18px;
																																			line-height: 26px;
																																			text-align: left;
																																			text-align-last: left;
																																			color: #767676;
																																			font-family: 'DM Sans',
																																				Arial,
																																				Helvetica,
																																				sans-serif;
																																			letter-spacing: 0px;
																																			font-weight: 400;
																																			font-style: normal;
																																		"
																																	>
																																		<div
																																			style="
																																				font-family: 'DM Sans',
																																					Arial,
																																					Helvetica,
																																					sans-serif;
																																				font-size: 20px;
																																				line-height: 30px;
																																			"
																																		>
																																			<span
																																				style="
																																					font-family: 'DM Sans',
																																						Arial,
																																						Helvetica,
																																						sans-serif;
																																					font-size: 20px;
																																					line-height: 30px;
																																				"
																																				class="pc-w620-font-size-18px pc-w620-line-height-26px"
																																				>Hi!
																																				👋,</span
																																			>
																																			<br /><span
																																				style="
																																					font-family: 'DM Sans',
																																						Arial,
																																						Helvetica,
																																						sans-serif;
																																					font-size: 20px;
																																					line-height: 30px;
																																				"
																																				class="pc-w620-font-size-18px pc-w620-line-height-26px"
																																				>Your
																																				one-time
																																				password
																																				(OTP)
																																				is:</span
																																			>
																																		</div>
																																	</div>
																																</div>
																															</td>
																														</tr>
																													</table>
																												</td>
																											</tr>
																										</table>
																									</td>
																								</tr>
																								<tr>
																									<td
																										align="center"
																										valign="top"
																									>
																										<table
																											width="100%"
																											border="0"
																											cellpadding="0"
																											cellspacing="0"
																											role="presentation"
																										>
																											<tr>
																												<td
																													class="pc-w620-spacing-0-0-20-0"
																													style="
																														padding: 0px
																															0px
																															40px
																															0px;
																													"
																												>
																													<table
																														class="pc-width-fill pc-w620-gridCollapsed-1"
																														width="100%"
																														border="0"
																														cellpadding="0"
																														cellspacing="0"
																														role="presentation"
																													>
																														<tr
																															class="pc-grid-tr-first pc-grid-tr-last"
																														>
																															<td
																																class="pc-grid-td-first pc-grid-td-last pc-w620-itemsSpacings-0-30"
																																align="center"
																																valign="middle"
																																style="
																																	padding-top: 0px;
																																	padding-right: 0px;
																																	padding-bottom: 0px;
																																	padding-left: 0px;
																																"
																															>
																																<table
																																	style="
																																		width: 100%;
																																	"
																																	border="0"
																																	cellpadding="0"
																																	cellspacing="0"
																																	role="presentation"
																																>
																																	<tr>
																																		<td
																																			class="pc-w620-padding-18-20-18-20"
																																			align="center"
																																			valign="middle"
																																			style="
																																				padding: 20px
																																					24px
																																					20px
																																					24px;
																																				mso-padding-left-alt: 0;
																																				margin-left: 24px;
																																				height: auto;
																																				background-color: #f7f7f7;
																																				border-radius: 12px
																																					12px
																																					12px
																																					12px;
																																			"
																																		>
																																			<table
																																				align="center"
																																				width="100%"
																																				border="0"
																																				cellpadding="0"
																																				cellspacing="0"
																																				role="presentation"
																																			>
																																				<tr>
																																					<td
																																						align="center"
																																						valign="top"
																																					>
																																						<table
																																							border="0"
																																							cellpadding="0"
																																							cellspacing="0"
																																							role="presentation"
																																							align="center"
																																						>
																																							<tr>
																																								<td
																																									valign="top"
																																									align="center"
																																								>
																																									<div
																																										class="pc-font-alt pc-w620-fontSize-32px"
																																										style="
																																											line-height: 50px;
																																											letter-spacing: -0.2px;
																																											font-family: 'DM Sans',
																																												Arial,
																																												Helvetica,
																																												sans-serif;
																																											font-size: 40px;
																																											font-weight: normal;
																																											color: #333333;
																																											text-align: center;
																																											text-align-last: center;
																																										"
																																									>
																																										<div>
																																											<span
																																												style="
																																													font-family: 'DM Sans',
																																														Arial,
																																														Helvetica,
																																														sans-serif;
																																													font-weight: 800;
																																													font-style: normal;
																																													color: #141414;
																																													letter-spacing: 15px;
																																												">${otp}</span>
																																										</div>
																																									</div>
																																								</td>
																																							</tr>
																																						</table>
																																					</td>
																																				</tr>
																																			</table>
																																		</td>
																																	</tr>
																																</table>
																															</td>
																														</tr>
																													</table>
																												</td>
																											</tr>
																										</table>
																									</td>
																								</tr>
																								<tr>
																									<td
																										align="center"
																										valign="top"
																									>
																										<table
																											width="100%"
																											align="center"
																											border="0"
																											cellpadding="0"
																											cellspacing="0"
																											role="presentation"
																										>
																											<tr>
																												<td
																													valign="top"
																												>
																													<table
																														border="0"
																														cellpadding="0"
																														cellspacing="0"
																														role="presentation"
																														width="100%"
																														align="left"
																													>
																														<tr>
																															<td
																																valign="top"
																																align="left"
																															>
																																<div
																																	class="pc-font-alt"
																																	style="
																																		text-decoration: none;
																																	"
																																>
																																	<div
																																		style="
																																			font-size: 18px;
																																			line-height: 26px;
																																			text-align: left;
																																			text-align-last: left;
																																			color: #767676;
																																			font-family: 'DM Sans',
																																				Arial,
																																				Helvetica,
																																				sans-serif;
																																			letter-spacing: 0px;
																																			font-weight: 400;
																																			font-style: normal;
																																		"
																																	>
																																		<div
																																			style="
																																				font-family: 'DM Sans',
																																					Arial,
																																					Helvetica,
																																					sans-serif;
																																			"
																																		>
																																			<span
																																				style="
																																					font-family: 'DM Sans',
																																						Arial,
																																						Helvetica,
																																						sans-serif;
																																					font-size: 20px;
																																					line-height: 30px;
																																				"
																																				class="pc-w620-font-size-18px pc-w620-line-height-26px"
																																				>This
																																				code
																																				is
																																				valid
																																				for
																																				the
																																				next&nbsp;5
																																				minutes.
																																				Please
																																				use
																																				it
																																				to
																																				complete
																																				the
																																				Password
																																				reset
																																				process.</span
																																			>
																																		</div>
																																		<div
																																			style="
																																				font-family: 'DM Sans',
																																					Arial,
																																					Helvetica,
																																					sans-serif;
																																				font-size: 20px;
																																				line-height: 30px;
																																			"
																																		>
																																			<br /><span
																																				style="
																																					font-family: 'DM Sans',
																																						Arial,
																																						Helvetica,
																																						sans-serif;
																																					font-size: 20px;
																																					line-height: 30px;
																																				"
																																				class="pc-w620-font-size-18px pc-w620-line-height-26px"
																																				>For
																																				security
																																				purposes,
																																				never
																																				share
																																				this
																																				code
																																				with
																																				anyone.
																																				If
																																				you
																																				didn’t
																																				request
																																				this,
																																				be
																																				sure
																																				to
																																				get
																																				in
																																				touch
																																				with
																																				our
																																				support
																																				team
																																				immediately.</span
																																			>
																																		</div>
																																	</div>
																																</div>
																															</td>
																														</tr>
																													</table>
																												</td>
																											</tr>
																										</table>
																									</td>
																								</tr>
																							</table>
																						</td>
																					</tr>
																				</table>
																			</td>
																			<td
																				class="pc-grid-td-last"
																				align="center"
																				valign="top"
																				style="
																					padding-top: 0px;
																					padding-right: 0px;
																					padding-bottom: 0px;
																					padding-left: 0px;
																					mso-padding-left-alt: 0;
																					margin-left: 0px;
																				"
																			></td>
																		</tr>
																	</table>
																	<table
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr>
																			<td
																				valign="top"
																				style="
																					padding: 20px
																						0px
																						20px
																						0px;
																				"
																			>
																				<table
																					width="100%"
																					border="0"
																					cellpadding="0"
																					cellspacing="0"
																					role="presentation"
																				>
																					<tr>
																						<td
																							valign="top"
																							style="
																								line-height: 1px;
																								font-size: 1px;
																								border-bottom: 2px
																									solid
																									#d9d9d9;
																							"
																						>
																							&nbsp;
																						</td>
																					</tr>
																				</table>
																			</td>
																		</tr>
																	</table>
																	<table
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr>
																			<td
																				align="center"
																				valign="top"
																			>
																				<table
																					border="0"
																					cellpadding="0"
																					cellspacing="0"
																					role="presentation"
																					width="100%"
																					align="center"
																					style="
																						margin-right: auto;
																						margin-left: auto;
																					"
																				>
																					<tr>
																						<td
																							valign="top"
																							align="center"
																						>
																							<div
																								class="pc-font-alt"
																								style="
																									text-decoration: none;
																								"
																							>
																								<div
																									style="
																										font-size: 18px;
																										line-height: 21px;
																										text-align: center;
																										text-align-last: center;
																										color: #ffffff;
																										font-family: 'DM Sans',
																											Arial,
																											Helvetica,
																											sans-serif;
																										letter-spacing: 0px;
																										font-weight: 500;
																										font-style: normal;
																									"
																								>
																									<div
																										style="
																											font-family: 'DM Sans',
																												Arial,
																												Helvetica,
																												sans-serif;
																										"
																									>
																										<span
																											style="
																												font-family: 'DM Sans',
																													Arial,
																													Helvetica,
																													sans-serif;
																												font-size: 18px;
																												line-height: 21px;
																											"
																											>Follow
																											us
																											on
																											Social
																											Media</span
																										>
																									</div>
																								</div>
																							</div>
																						</td>
																					</tr>
																				</table>
																			</td>
																		</tr>
																	</table>
																	<table
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	>
																		<tr>
																			<td
																				valign="top"
																			>
																				<div
																					class="social-icons"
																				>
																					<div
																						class="social-strip"
																					>
																						<a
																							href="https://facebook.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<img
																								src="https://www.svgrepo.com/show/452196/facebook-1.svg"
																								alt="Facebook"
																							/>
																						</a>
																						<a
																							href="https://instagram.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<img
																								src="https://www.svgrepo.com/show/452229/instagram-1.svg"
																								alt="Instagram"
																							/>
																						</a>
																						<a
																							href="https://twitter.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<svg
																								xmlns="http://www.w3.org/2000/svg"
																								width="16"
																								height="16"
																								fill="white"
																								class="bi bi-twitter-x"
																								viewBox="0 0 16 16"
																							>
																								<path
																									d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
																								/>
																							</svg>
																						</a>
																						<a
																							href="https://youtube.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<img
																								src="https://www.svgrepo.com/show/452138/youtube.svg"
																								alt="YouTube"
																							/>
																						</a>
																						<a
																							href="https://linkedin.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<img
																								src="https://www.svgrepo.com/show/452047/linkedin-1.svg"
																								alt="LinkedIn"
																							/>
																						</a>
																						<a
																							href="https://tiktok.com"
																							class="social-btn"
																							target="_blank"
																						>
																							<img
																								src="https://www.svgrepo.com/show/349530/tiktok.svg"
																								alt="TikTok"
																							/>
																						</a>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																	<!--[if gte mso 9]>
                                                </td>
                                                <td width="16" style="line-height: 1px; font-size: 1px;" valign="top">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" height="0" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
                    </v:textbox>
                </v:rect>
                <![endif]-->
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
											<!-- END MODULE: Header -->
										</td>
									</tr>
									<tr>
										<td valign="top">
											<!-- BEGIN MODULE: Thank You -->
											<table
												width="100%"
												border="0"
												cellspacing="0"
												cellpadding="0"
												role="presentation"
											>
												<tr>
													<td
														class="pc-w620-spacing-0-0-0-0"
														width="100%"
														border="0"
														cellspacing="0"
														cellpadding="0"
														role="presentation"
													>
														<table
															width="100%"
															border="0"
															cellspacing="0"
															cellpadding="0"
															role="presentation"
														>
															<tr>
																<td
																	valign="top"
																	class="pc-w620-padding-16-16-16-16"
																	style="
																		padding: 16px
																			16px
																			8px
																			16px;
																		height: unset;
																		background-color: #000000;
																	"
																	bgcolor="#000000"
																>
																	<table
																		class="pc-width-fill pc-w620-gridCollapsed-1"
																		width="100%"
																		border="0"
																		cellpadding="0"
																		cellspacing="0"
																		role="presentation"
																	></table>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
											<!-- END MODULE: Thank You -->
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>
`;
};

export const PasswordResetSuccess = (name: string) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Updated</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .content {
      padding: 24px;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      padding: 24px;
      text-align: center;
      color: #999999;
      font-size: 14px;
    }
    a {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="content">
      <p>Hi <strong>${name || "User"}</strong>,</p>

      <p>We wanted to let you know that your password was successfully updated.</p>

      <p>If this change wasn’t made by you, please <a href="https://trakg.com/reset-password">reset your password</a> immediately or contact our support team.</p>

      <p>Need help? We’re always here: <a href="mailto:support@trakg.com">support@trakg.com</a></p>

      <p>Thanks for using Trakg!</p>

      <p>— Team Trakg</p>
    </div>
    <div class="footer">
      © 2025 Trakg. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};
