<script>
	// import {micromark} from 'micromark';
	import { position, offset } from 'caret-pos';
	import Editor from "./lib/Editor.svelte";

	let text;
	let html;
	let content;
	let _parsing=false;
	// $: {
	// 	if (content && !_parsing) {
	// 		_parsing=true;

	// 		// let active = document.activeElement;
	// 		let active = window.getSelection().focusNode;
	// 		if (active) {
	// 			try {
	// 				console.log('active', active.parentElement)
	// 				active.parentElement.contentEditable = true;
	// 				let pos = position(active.parentElement);
	// 				console.log('post', pos)
	// 			} catch(e) {
	// 				console.error(e)
	// 			}
	// 		}
	// 		console.log(html)
	// 		// const format = templateFormatter(TEMPLATE)

	// 		// text;
	// 		// console.log('content', content.innerText)
	// 		// let _text = content.innerText;
	// 		// console.log(_text);
	// 		// if (_text) {
	// 		// 	html = micromark(_text);
	// 		// 	console.log('html', html);
	// 		// 	// content.innerHTML = html;
	// 		// 	// console.log('htmol', html)
	// 		// }
	// 		_parsing=false;
	// 	};// 
	// }

</script>

<main>
	<div class='content'>
		<Editor/>
	</div>
	<!-- <div class='content' bind:this={content} bind:textContent={text} bind:innerHTML={html} contenteditable="true"> -->
		<!-- # Test <br> -->
		<!-- --- <br> -->
		<!-- *this has* to be **bold** -->
	<!-- </div> -->
</main>

<style global lang="scss">
	.content {
		width: 80vw;
		height: 80vh;
		border: 1px solid whitesmoke;
		margin: auto;
		padding: 20px 30px;
		position: relative;
	}
	:root {
		--main: whitesmoke;
		--sec: rgb(39, 62, 138);
		// --sec: #525252;
		--bg: #030303;
	}

	.mono-font {
		font-family: 'Ubuntu Mono', monospace;
	}


	main {
		margin: 15px;
	}
	.flex {
		display: flex;
		align-items: center;

		&.wrap {
			flex-wrap: wrap;
		}

		&.stretch {
			align-items: stretch;
			justify-content: stretch;
		}

		&.col {
			flex-direction: column;
		}

		&.flex-start {
			align-items: flex-start;
		}

		&.space-between {
			justify-content: space-between;
		}
	}

	.w {
		&-100 {
			width: 100%;
		}
	}

	.bordered {
		border: 1px solid var(--sec);
		// border-radius: 5px;
	}

	body {
		margin: 0;
	}
	html {
		@extend .mono-font;
		color: var(--main);
		background-color: var(--bg);

		* {
			@extend .mono-font;
			color: var(--main);
		}

		$typography: (
			"h1": 50px,
			"h2": 42px,
			"h3": 33px,
			"h4": 26px,
			"h5": 20px,
			"body-1": 16px, 
			"body-2": 14px, 
		);

		@each $type, $size in $typography {
			#{$type}, .#{$type} {
				font-size: $size;
			}
		}


		h1,
		h2,
		h2,
		h3,
		h4,
		h5,
		.h1, .h2, .h3, .h4, .h5
		{
			font-weight: 700;
		}

		button, .button {
			cursor: pointer;
			user-select: none;
			flex-wrap: nowrap;
			// width: fit-content;
			white-space: nowrap;
			background: transparent;
			border: 0;
			padding: 12px 15px;
			display: inline-flex;
			margin: 5px 0;
			justify-content: center;
			text-align: center;
			// border-radius: 5px;
			font-weight: 900;
			@extend .default-transition;

			&:hover {
				filter: brightness(1.5);
			}

			&.main {
				background-color: var(--sec);
			}

			&.fit {
				min-width: fit-content;
			}

			&.danger {
				background-color: rgb(184, 38, 12)			}
		}

		.default-transition {
			transition: all .2s ease;
		}
		input, textarea {
			background: transparent;
			border: 1px solid transparent;
			padding: 12px 10px;
			margin: 5px -10px;
			// margin: 10px 0;
			outline: 0;
			@extend .default-transition;
				// border-radius: 5px;

			&:hover {
				border: 1px solid rgba(245, 245, 245, 0.2);
			}
			&:focus {
				border: 1px solid rgba(245, 245, 245, 0.6);
			}
		}

		.p-0 {
			padding: 0;
		}
	}
</style>
