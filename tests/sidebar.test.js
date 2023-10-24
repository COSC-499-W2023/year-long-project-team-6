// sidebar.test.js

import { fireEvent } from "@testing-library/dom";
import "../node_modules/@testing-library/jest-dom";
import { initializeSidebar } from '../app/UI-bars/sidebar';
import { searchGroup } from '../app/UI-bars/sidebar';
import { moveanchor } from '../app/UI-bars/sidebar';
// Mock the content of your sidebar.js file
// Note: You may have to modify the import to fit your directory structure
import '../app/UI-bars/sidebar';

describe('Sidebar Tests', () => {
  beforeAll(() => {
    // Set up our document body
    document.body.innerHTML = `
      <div id="myModal" style="display:none;"></div>
      <button id="myBtn"></button>
      <span class="close"></span>
      <input id="searchInput" />
      <div id="resultContainer"></div>
      <ul>
        <li><a>Link 1</a></li>
        <li><a class="addgroup">Add Group</a></li>
        <li><a>Link 2</a></li>
      </ul>
    `;
  });

  test('open and close modal', () => {
    initializeSidebar();
    const modal = document.getElementById('myModal');
    const btn = document.getElementById('myBtn');
    const span = document.querySelector('.close');

    fireEvent.click(btn);
    expect(modal).toHaveStyle('display: block');

    fireEvent.click(span);
    expect(modal).toHaveStyle('display: none');
  });

  test('search group function', () => {
    searchGroup();
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');

    fireEvent.change(searchInput, { target: { value: '12345' } });
    fireEvent.input(searchInput);
    searchGroup();
    expect(resultContainer.innerHTML).toBe('Searching for group with code: 12345');
    
    searchInput.value = '1234';
    fireEvent.input(searchInput);
    searchGroup();
    expect(resultContainer.innerHTML).toBe('Please enter a 5-character code.');
  });

  test('add active class to links', () => {
    moveanchor();
    const links = document.querySelectorAll('li a');

    fireEvent.click(links[0]);
    expect(links[0]).toHaveClass('active');
    expect(links[1]).not.toHaveClass('active');

    fireEvent.click(links[1]);
    expect(links[0]).toHaveClass('active');
    expect(links[1]).not.toHaveClass('active');

    fireEvent.click(links[2]);
    expect(links[2]).toHaveClass('active');
    expect(links[1]).not.toHaveClass('active');
  });
});
