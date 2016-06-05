

describe ("JavaScript Application:", function(){
	describe ("When Jasmine Specs designed with ", function(){
		describe("HTML Fixture: ", function(){

			beforeEach(function() {
				jasmine.getFixtures().fixturesPath = 'spec/fixtures';
			});

			// loads the fixture(s) from one or more HTML files and 
			// makes it available or appends it to DOM.
			describe("'loadFixtures' Method, ", function(){
				beforeEach(function() {
					loadFixtures('HTML_Fixture.html');
				});

				it("Load fixture from a file", function(){
					expect($('.myULClass')).toExist();
					expect($('#my-fixture')).toExist();
				});
			});

			// loads the fixture(s) from one or more files and 
			// returns them as a string instead of appending to the DOM.
			describe("'readFixtures' Method, ", function(){
				var myFixture;
				beforeEach(function() {
					myFixture = readFixtures('HTML_Fixture.html');
				});
				
				it("Read fixture from a file", function(){
					expect(myFixture).toContainText(/Munish/);
					expect($(myFixture).find("li")).toHaveText(/Sethi/);
				});
			});

			// does not load fixtures from a string of HTML, but instead gets
			// it directly as an HTML parameter and automatically appends the 
			// fixture to the DOM (in the fixtures container). You can also
			// pass a jQuery object instead of an HTML string.
			describe("'setFixtures' Method, ", function(){
				beforeEach(function() {
					setFixtures('<div class="FixtureClass">Jasmine Cookbook</div>');
				});
				
				it("Receive fixture as a parameter", function(){
					expect($('.FixtureClass')).toExist();
				});
			});
			
		});
	});
});