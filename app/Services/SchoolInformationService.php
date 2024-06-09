<?php
use App\Models\SchoolInformation;
class SchoolInformationService
{


    public function getInputs(Request $request) : array
    {
        return $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'phone_number' => 'required|digits:11',
            'logo_path' => 'required|string',
        ]);
    }

    /**
     * This method saves the school information into the database.
     * 
     * It first validates the user's input by calling the getInputs method.
     * The validated input is then used to create a new instance of the SchoolInformation model.
     * The model's attributes are set with the validated input.
     * Finally, the model is saved into the database.
     * 
     * @return void
     */
    public function save(): void
    {
        // Get the validated input from the user's request
        $request = $this->getInputs(request());

        // Create a new instance of the SchoolInformation model
        $school = new SchoolInformation();

        // Set the model's attributes with the validated input
        $school->name = $request['name'];
        $school->address = $request['address'];
        $school->phone_number = $request['phone_number'];
        $school->logo_path = $request['logo_path'];

        // Save the model into the database
        $school->save();
    }
}
